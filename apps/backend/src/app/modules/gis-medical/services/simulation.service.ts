import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { fn, col, literal } from 'sequelize';
import { GeoPoint } from '@gis-medical/shared';
import { AmbulanceVehicle } from '../../../models/ambulance-vehicle.model';
import { AmbulanceVehicleHistoryLog } from '../../../models/ambulance-vehicle-history-log.model';
import { MedicalFacility } from '../../../models/medical-facility.model';
import { MedicalFacilityHistoryLog } from '../../../models/medical-facility-history-log.model';

interface SimulationState {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  vehicleTargets: Map<number, { target: [number, number]; speed: number }>;
}

@Injectable()
export class SimulationService implements OnModuleDestroy {
  private readonly logger = new Logger(SimulationService.name);
  private state: SimulationState = {
    running: false,
    intervalId: null,
    vehicleTargets: new Map(),
  };

  private readonly TICK_INTERVAL = 2000;
  private readonly MOVEMENT_SPEED = 0.0002;
  private readonly ARRIVAL_THRESHOLD = 0.001;

  get isRunning(): boolean {
    return this.state.running;
  }

  constructor(
    @InjectModel(AmbulanceVehicle)
    private vehicleModel: typeof AmbulanceVehicle,
    @InjectModel(AmbulanceVehicleHistoryLog)
    private vehicleLogModel: typeof AmbulanceVehicleHistoryLog,
    @InjectModel(MedicalFacility)
    private facilityModel: typeof MedicalFacility,
    @InjectModel(MedicalFacilityHistoryLog)
    private facilityLogModel: typeof MedicalFacilityHistoryLog,
  ) {}

  onModuleDestroy() {
    this.stop();
  }

  async start() {
    if (this.state.running) {
      return;
    }

    const vehicles = await this.vehicleModel.findAll();
    if (vehicles.length === 0) {
      this.logger.warn('No vehicles found. Run seed first.');
      return;
    }

    const facilities = await this.facilityModel.findAll();
    if (facilities.length === 0) {
      this.logger.warn('No facilities found. Run seed first.');
      return;
    }

    for (const vehicle of vehicles) {
      this.assignNewTarget(vehicle, facilities);
    }

    this.state.running = true;
    this.state.intervalId = setInterval(() => this.tick(), this.TICK_INTERVAL);

    this.logger.log(`Simulation started with ${vehicles.length} vehicles`);
  }

  stop() {
    if (!this.state.running) {
      return;
    }

    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }

    this.state.running = false;
    this.state.vehicleTargets.clear();

    this.logger.log('Simulation stopped');
  }

  private async tick() {
    try {
      const vehicles = await this.vehicleModel.findAll();
      const facilities = await this.facilityModel.findAll();

      for (const vehicle of vehicles) {
        const target = this.state.vehicleTargets.get(vehicle.id);
        if (!target) {
          this.assignNewTarget(vehicle, facilities);
          continue;
        }

        const coords = (vehicle.location as unknown as GeoPoint).coordinates;
        const dx = target.target[0] - coords[0];
        const dy = target.target[1] - coords[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.ARRIVAL_THRESHOLD) {
          await this.handleArrival(vehicle);
          continue;
        }

        const angle = Math.atan2(dy, dx);
        const newLon = coords[0] + Math.cos(angle) * this.MOVEMENT_SPEED;
        const newLat = coords[1] + Math.sin(angle) * this.MOVEMENT_SPEED;

        const wasBusy = vehicle.isBusy;
        const shouldBecomeBusy = Math.random() > 0.95;
        const shouldBecomeFree = vehicle.isBusy && Math.random() > 0.9;

        let newBusyState = vehicle.isBusy;
        if (shouldBecomeBusy && !vehicle.isBusy) {
          newBusyState = true;
        } else if (shouldBecomeFree && vehicle.isBusy) {
          newBusyState = false;
        }

        await vehicle.update({
          location: { type: 'Point', coordinates: [newLon, newLat] } as GeoPoint,
          isBusy: newBusyState,
        });

        if (wasBusy !== newBusyState) {
          await this.vehicleLogModel.create({
            vehicleId: vehicle.id,
            isBusyState: newBusyState,
          });
        }
      }
    } catch (error) {
      this.logger.error('Simulation tick error:', error);
    }
  }

  private async handleArrival(vehicle: AmbulanceVehicle) {
    const coords = (vehicle.location as unknown as GeoPoint).coordinates;

    const nearestFacility = await this.findNearestFacilityViaPostGIS(coords[0], coords[1]);
    if (nearestFacility) {
      await this.simulateFacilityVisit(nearestFacility);
    }

    this.state.vehicleTargets.delete(vehicle.id);

    const facilities = await this.facilityModel.findAll();
    this.assignNewTarget(vehicle, facilities);
  }

  private async findNearestFacilityViaPostGIS(longitude: number, latitude: number) {
    return this.facilityModel.findOne({
      attributes: {
        include: [
          [
            fn(
              'ST_Distance',
              col('position'),
              literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`)
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
      limit: 1,
    });
  }

  private async simulateFacilityVisit(facility: MedicalFacility) {
    const currentBeds = facility.availableBeds;
    const totalBeds = facility.totalBeds;

    const change = Math.random() > 0.5 ? 1 : -1;
    const newAvailable = Math.max(0, Math.min(totalBeds, currentBeds + change));

    if (newAvailable !== currentBeds) {
      await facility.update({ availableBeds: newAvailable });
      await this.facilityLogModel.create({
        medicalFacilityId: facility.id,
        availableBedsState: newAvailable,
      });
    }
  }

  private assignNewTarget(
    vehicle: AmbulanceVehicle,
    facilities: MedicalFacility[],
  ) {
    if (facilities.length === 0) return;

    const randomFacility =
      facilities[Math.floor(Math.random() * facilities.length)];
    const coords = (randomFacility.position as unknown as GeoPoint).coordinates;

    const jitterLon = coords[0] + (Math.random() - 0.5) * 0.005;
    const jitterLat = coords[1] + (Math.random() - 0.5) * 0.005;

    const speed = this.MOVEMENT_SPEED * (0.5 + Math.random());

    this.state.vehicleTargets.set(vehicle.id, {
      target: [jitterLon, jitterLat],
      speed,
    });
  }
}
