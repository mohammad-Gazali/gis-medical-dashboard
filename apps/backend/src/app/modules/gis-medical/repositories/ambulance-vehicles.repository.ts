import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AmbulanceVehicle } from '../../../models/ambulance-vehicle.model';
import { AmbulanceVehicleHistoryLog } from '../../../models/ambulance-vehicle-history-log.model';
import { GeoPoint } from '@gis-medical/shared';

@Injectable()
export class AmbulanceVehiclesRepository {
  constructor(
    @InjectModel(AmbulanceVehicle)
    private vehicleModel: typeof AmbulanceVehicle,
    @InjectModel(AmbulanceVehicleHistoryLog)
    private ambulanceVehicleHistoryLogModel: typeof AmbulanceVehicleHistoryLog,
  ) {}

  public async findAll() {
    return this.vehicleModel.findAll();
  }

  public async updateLocation(id: number, location: GeoPoint, isBusy: boolean) {
    await this.vehicleModel.update({ location, isBusy }, { where: { id } });

    await this.ambulanceVehicleHistoryLogModel.create({
      vehicleId: id,
      isBusyState: isBusy,
      locationState: location,
    });
  }

  public addAfterCreateHookForHistoryLog(
    name: string,
    fn: (instance: AmbulanceVehicleHistoryLog) => void,
  ) {
    this.ambulanceVehicleHistoryLogModel.addHook('afterCreate', name, fn);
  }

  public removeAfterCreateHookForHistoryLog(name: string) {
    this.ambulanceVehicleHistoryLogModel.removeHook('afterCreate', name);
  }
}
