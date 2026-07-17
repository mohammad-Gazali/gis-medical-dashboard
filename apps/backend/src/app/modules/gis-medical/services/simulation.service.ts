import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  GeoPoint,
  AmbulanceVehicle,
  MedicalFacility,
} from '@gis-medical/shared';
import {
  AmbulanceVehiclesRepository,
  MedicalFacilitiesRepository,
} from '../repositories';

/**
 * Ambulance lifecycle this simulation drives, per vehicle:
 *
 *   idle (parked at base)
 *     -> dispatched   (incident occurs nearby, vehicle assigned, driving to scene)
 *     -> atScene       (brief pause — "loading" the patient)
 *     -> transporting  (driving to nearest facility with free capacity)
 *     -> atHospital    (brief pause — "unloading", facility occupancy updated)
 *     -> returning     (driving back to home base)
 *     -> idle
 *
 * isBusy (the persisted boolean) is simply `state !== 'idle'`. Only vehicles
 * that actually moved or changed state this tick get a history-log row —
 * this keeps the table from filling with duplicate rows for parked vehicles,
 * and (importantly) keeps using the existing per-row `afterCreate` hook that
 * broadcasts over the socket, so only ambulances that are actually doing
 * something push live updates to connected clients.
 */
type VehicleState =
  | 'idle'
  | 'dispatched'
  | 'atScene'
  | 'transporting'
  | 'atHospital'
  | 'returning';

interface VehicleRuntime {
  state: VehicleState;
  target: [number, number] | null;
  baseCoords: [number, number];
  targetFacilityId: number | null;
  waitTicksRemaining: number;
}

interface FacilityRuntime {
  coords: [number, number];
}

@Injectable()
export class SimulationService implements OnModuleDestroy {
  private readonly logger = new Logger(SimulationService.name);

  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private vehicleRuntime = new Map<number, VehicleRuntime>();
  private facilityRuntime = new Map<number, FacilityRuntime>();

  private readonly TICK_INTERVAL_MS = 2000;

  // Speeds are in degrees-of-lat/lng moved per tick — rough stand-ins for
  // "urgent" vs "normal" driving, tuned so a cross-governorate trip takes a
  // realistic-looking number of ticks (tens of seconds to a couple of
  // minutes) rather than teleporting or crawling.
  private readonly SPEED_DISPATCHED = 0.0035;
  private readonly SPEED_TRANSPORTING = 0.003;
  private readonly SPEED_RETURNING = 0.002;
  private readonly ARRIVAL_THRESHOLD = 0.0015;

  private readonly SCENE_WAIT_TICKS = 2; // ~4s "loading patient"
  private readonly HOSPITAL_WAIT_TICKS = 2; // ~4s "handover"

  // Chance, per tick, that a new incident is generated somewhere in Syria.
  private readonly INCIDENT_CHANCE_PER_TICK = 0.35;

  // Chance, per tick, that an occupied bed at a random facility is freed up
  // (discharge) independent of ambulance drop-offs — real hospitals turn
  // over beds constantly, not only when an ambulance happens to arrive.
  private readonly DISCHARGE_CHANCE_PER_TICK = 0.25;

  get isRunning(): boolean {
    return this.running;
  }

  constructor(
    private ambulanceVehiclesRepository: AmbulanceVehiclesRepository,
    private medicalFacilitiesRepository: MedicalFacilitiesRepository,
  ) {}

  onModuleDestroy() {
    this.stop();
  }

  async start() {
    if (this.running) return;

    const vehicles = await this.ambulanceVehiclesRepository.findAll();
    const facilities = await this.medicalFacilitiesRepository.findAll();

    if (vehicles.length === 0 || facilities.length === 0) {
      this.logger.warn('No vehicles/facilities found. Run the seeder first.');
      return;
    }

    this.facilityRuntime.clear();
    for (const facility of facilities as unknown as MedicalFacility[]) {
      this.facilityRuntime.set(facility.id, {
        coords: (facility.position as unknown as GeoPoint).coordinates,
      });
    }

    // Always start every vehicle from a clean "idle at base" runtime state,
    // regardless of whatever isBusy value the seeder happened to set — the
    // simulation is the single source of truth for state once it's running,
    // so we normalize the DB to match rather than trying to resume a
    // mid-dispatch state we have no record of.
    this.vehicleRuntime.clear();
    for (const vehicle of vehicles as unknown as AmbulanceVehicle[]) {
      const coords = (vehicle.location as unknown as GeoPoint).coordinates;
      this.vehicleRuntime.set(vehicle.id, {
        state: 'idle',
        target: null,
        baseCoords: coords,
        targetFacilityId: null,
        waitTicksRemaining: 0,
      });

      if (vehicle.isBusy) {
        await this.ambulanceVehiclesRepository.updateLocation(
          vehicle.id,
          vehicle.location,
          false,
        );
      }
    }

    this.running = true;
    this.intervalId = setInterval(() => {
      this.tick().catch((err) =>
        this.logger.error('Simulation tick error:', err),
      );
    }, this.TICK_INTERVAL_MS);

    this.logger.log(
      `Simulation started with ${vehicles.length} vehicles across ${facilities.length} facilities`,
    );
  }

  stop() {
    if (!this.running) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.running = false;
    this.vehicleRuntime.clear();
    this.facilityRuntime.clear();

    this.logger.log('Simulation stopped');
  }

  private async tick() {
    await this.maybeSpawnIncident();
    await this.maybeDischargeBed();

    const vehicles = await this.ambulanceVehiclesRepository.findAll();

    for (const vehicle of vehicles as unknown as AmbulanceVehicle[]) {
      const runtime = this.vehicleRuntime.get(vehicle.id);
      if (!runtime) continue;

      await this.stepVehicle(vehicle, runtime);
    }
  }

  private async stepVehicle(
    vehicle: AmbulanceVehicle,
    runtime: VehicleRuntime,
  ) {
    switch (runtime.state) {
      case 'idle':
        // nothing to do — waiting to be dispatched by maybeSpawnIncident()
        return;

      case 'dispatched':
      case 'transporting':
      case 'returning': {
        const speed =
          runtime.state === 'dispatched'
            ? this.SPEED_DISPATCHED
            : runtime.state === 'transporting'
              ? this.SPEED_TRANSPORTING
              : this.SPEED_RETURNING;

        const arrived = await this.moveTowardsTarget(vehicle, runtime, speed);
        if (!arrived) return;

        if (runtime.state === 'dispatched') {
          runtime.state = 'atScene';
          runtime.waitTicksRemaining = this.SCENE_WAIT_TICKS;
          // no history row here — position didn't change further, just status
          return;
        }

        if (runtime.state === 'transporting') {
          await this.handleHospitalArrival(vehicle, runtime);
          return;
        }

        if (runtime.state === 'returning') {
          runtime.state = 'idle';
          runtime.target = null;
          await this.persistVehicleTick(vehicle.id, false, runtime.baseCoords);
          return;
        }
        return;
      }

      case 'atScene': {
        runtime.waitTicksRemaining -= 1;
        if (runtime.waitTicksRemaining <= 0) {
          const nearestFacility =
            await this.medicalFacilitiesRepository.findNearestFacilityWithCapacity(
              vehicle.location
                ? (vehicle.location as unknown as GeoPoint).coordinates[0]
                : runtime.baseCoords[0],
              vehicle.location
                ? (vehicle.location as unknown as GeoPoint).coordinates[1]
                : runtime.baseCoords[1],
            );

          if (!nearestFacility) {
            // no facility has free capacity anywhere nearby — return to base
            // rather than getting stuck, this is a real dispatch fallback.
            runtime.state = 'returning';
            runtime.target = runtime.baseCoords;
            return;
          }

          runtime.state = 'transporting';
          runtime.targetFacilityId = nearestFacility.id;
          runtime.target = (
            nearestFacility.position as unknown as GeoPoint
          ).coordinates;
        }
        return;
      }

      case 'atHospital': {
        runtime.waitTicksRemaining -= 1;
        if (runtime.waitTicksRemaining <= 0) {
          runtime.state = 'returning';
          runtime.target = runtime.baseCoords;
        }
        return;
      }
    }
  }

  private async moveTowardsTarget(
    vehicle: AmbulanceVehicle,
    runtime: VehicleRuntime,
    speed: number,
  ): Promise<boolean> {
    if (!runtime.target) return true;

    const coords = (vehicle.location as unknown as GeoPoint).coordinates;
    const dx = runtime.target[0] - coords[0];
    const dy = runtime.target[1] - coords[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.ARRIVAL_THRESHOLD) {
      return true;
    }

    const angle = Math.atan2(dy, dx);
    const step = Math.min(speed, distance);
    const newLocation: GeoPoint = {
      type: 'Point',
      coordinates: [
        coords[0] + Math.cos(angle) * step,
        coords[1] + Math.sin(angle) * step,
      ],
    };

    const isBusy = runtime.state !== 'idle';
    await this.persistVehicleTick(
      vehicle.id,
      isBusy,
      newLocation.coordinates,
      newLocation,
    );

    return false;
  }

  private async handleHospitalArrival(
    vehicle: AmbulanceVehicle,
    runtime: VehicleRuntime,
  ) {
    if (runtime.targetFacilityId) {
      await this.admitPatient(runtime.targetFacilityId);
    }
    runtime.state = 'atHospital';
    runtime.waitTicksRemaining = this.HOSPITAL_WAIT_TICKS;
  }

  private async admitPatient(facilityId: number) {
    const facility = await this.medicalFacilitiesRepository.findAll();
    const target = (facility as unknown as MedicalFacility[]).find(
      (f) => f.id === facilityId,
    );
    if (!target || target.availableBeds <= 0) return;

    const newAvailable = target.availableBeds - 1;
    await this.medicalFacilitiesRepository.updateAvailableBeds(
      facilityId,
      newAvailable,
    );
  }

  private async persistVehicleTick(
    vehicleId: number,
    isBusy: boolean,
    coordinates: [number, number],
    explicitLocation?: GeoPoint,
  ) {
    const location: GeoPoint = explicitLocation ?? {
      type: 'Point',
      coordinates,
    };
    await this.ambulanceVehiclesRepository.updateLocation(
      vehicleId,
      location,
      isBusy,
    );
  }

  private async maybeSpawnIncident() {
    if (Math.random() > this.INCIDENT_CHANCE_PER_TICK) return;

    const idleVehicleIds = [...this.vehicleRuntime.entries()]
      .filter(([, runtime]) => runtime.state === 'idle')
      .map(([id]) => id);

    if (idleVehicleIds.length === 0) return;

    const vehicles = await this.ambulanceVehiclesRepository.findAll();
    const vehicleMap = new Map(
      (vehicles as unknown as AmbulanceVehicle[]).map((v) => [v.id, v]),
    );

    // Incident happens somewhere near a random idle vehicle's base rather
    // than a fully random point on the map — keeps dispatch distances
    // realistic (an ambulance in Homs won't be sent to a call in Raqqa).
    const candidateId =
      idleVehicleIds[Math.floor(Math.random() * idleVehicleIds.length)];
    const candidateVehicle = vehicleMap.get(candidateId);
    const candidateRuntime = this.vehicleRuntime.get(candidateId);
    if (!candidateVehicle || !candidateRuntime) return;

    const baseCoords = candidateRuntime.baseCoords;
    const incidentPoint: [number, number] = [
      baseCoords[0] + (Math.random() - 0.5) * 0.06,
      baseCoords[1] + (Math.random() - 0.5) * 0.06,
    ];

    // Find the nearest *idle* vehicle to the incident, not just the one that
    // happened to seed the incident's location.
    let nearestId = candidateId;
    let nearestDist = Infinity;
    for (const id of idleVehicleIds) {
      const v = vehicleMap.get(id);
      if (!v) continue;
      const coords = (v.location as unknown as GeoPoint).coordinates;
      const d = Math.hypot(
        coords[0] - incidentPoint[0],
        coords[1] - incidentPoint[1],
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = id;
      }
    }

    const dispatchedRuntime = this.vehicleRuntime.get(nearestId);
    if (!dispatchedRuntime) return;

    dispatchedRuntime.state = 'dispatched';
    dispatchedRuntime.target = incidentPoint;

    const dispatchedVehicle = vehicleMap.get(nearestId);
    if (dispatchedVehicle) {
      // flip isBusy immediately so the UI reflects dispatch even before the
      // first movement tick.
      await this.persistVehicleTick(
        nearestId,
        true,
        (dispatchedVehicle.location as unknown as GeoPoint).coordinates,
      );
    }
  }

  private async maybeDischargeBed() {
    if (Math.random() > this.DISCHARGE_CHANCE_PER_TICK) return;

    const facilities = await this.medicalFacilitiesRepository.findAll();
    const list = facilities as unknown as MedicalFacility[];
    if (list.length === 0) return;

    const facility = list[Math.floor(Math.random() * list.length)];
    if (facility.availableBeds >= facility.totalBeds) return;

    const newAvailable = facility.availableBeds + 1;
    await this.medicalFacilitiesRepository.updateAvailableBeds(
      facility.id,
      newAvailable,
    );
  }
}
