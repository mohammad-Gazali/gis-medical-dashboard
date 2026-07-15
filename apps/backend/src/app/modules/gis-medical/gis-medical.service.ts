import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AmbulanceVehicleHistoryLog } from '../../models/ambulance-vehicle-history-log.model';
import { MedicalFacilityHistoryLog } from '../../models/medical-facility-history-log.model';
import { Socket } from 'socket.io';

@Injectable()
export class GisMedicalService {
  constructor(
    @InjectModel(AmbulanceVehicleHistoryLog)
    private ambulanceVehicleHistoryLogModel: typeof AmbulanceVehicleHistoryLog,
    @InjectModel(MedicalFacilityHistoryLog)
    private medicalFacilityHistoryLogModel: typeof MedicalFacilityHistoryLog,
  ) {}

  public handleConnection(socket: Socket) {
    this.ambulanceVehicleHistoryLogModel.addHook("afterCreate", `hook-create-ambulance-vehicle-log-${socket.id}`, (instance) => {
      // TODO
      console.log(instance.toJSON());
    });

    this.medicalFacilityHistoryLogModel.addHook("afterCreate", `hook-create-medical-facility-log-${socket.id}`, (instance) => {
      // TODO
      console.log(instance.toJSON());
    });
  }

  public handleDisconnection(socket: Socket) {
    this.ambulanceVehicleHistoryLogModel.removeHook("afterCreate", `hook-create-ambulance-vehicle-log-${socket.id}`);
    this.medicalFacilityHistoryLogModel.removeHook("afterCreate", `hook-create-medical-facility-log-${socket.id}`);
  }
}
