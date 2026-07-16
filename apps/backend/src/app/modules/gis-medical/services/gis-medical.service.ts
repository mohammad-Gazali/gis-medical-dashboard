import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  VehicleLogPayload,
  FacilityLogPayload,
  EntitiesResponse,
} from '@gis-medical/shared';
import { AmbulanceVehiclesRepository, MedicalFacilityRepository } from '../repositories';

@Injectable()
export class GisMedicalService {
  constructor(
    private ambulanceVehiclesRepository: AmbulanceVehiclesRepository,
    private medicalFacilityRepository: MedicalFacilityRepository,
  ) {}

  public handleConnectSocket(socket: Socket) {
    this.ambulanceVehiclesRepository.addAfterCreateHookForHistoryLog(
      `broadcast-vehicle-log-${socket.id}`,
      (instance) => {
        const payload: VehicleLogPayload = {
          vehicleId: instance.vehicleId,
          isBusyState: instance.isBusyState,
          timestamp: instance.createdAt,
        };
        socket.emit('vehicle:log', payload);
      },
    );

    this.medicalFacilityRepository.addAfterCreateHookForHistoryLog(
      `broadcast-facility-log-${socket.id}`,
      (instance) => {
        const payload: FacilityLogPayload = {
          facilityId: instance.medicalFacilityId,
          availableBedsState: instance.availableBedsState,
          timestamp: instance.createdAt,
        };
        socket.emit('facility:log', payload);
      },
    );
  }

  public handleDisconnectSocket(socket: Socket) {
    this.ambulanceVehiclesRepository.removeAfterCreateHookForHistoryLog(
      `broadcast-vehicle-log-${socket.id}`,
    );
    this.medicalFacilityRepository.removeAfterCreateHookForHistoryLog(
      `broadcast-facility-log-${socket.id}`,
    );
  }

  public async getAllEntities(): Promise<EntitiesResponse> {
    const [facilities, vehicles] = await Promise.all([
      this.medicalFacilityRepository.getFacilities(),
      this.ambulanceVehiclesRepository.getVehicles(),
    ]);

    return {
      facilities: facilities.map((f) => f.toJSON()),
      vehicles: vehicles.map((v) => v.toJSON()),
    };
  }
}
