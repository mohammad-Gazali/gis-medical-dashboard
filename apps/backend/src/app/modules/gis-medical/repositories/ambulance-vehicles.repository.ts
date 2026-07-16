import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AmbulanceVehicle } from "../../../models/ambulance-vehicle.model";
import { AmbulanceVehicleHistoryLog } from "../../../models/ambulance-vehicle-history-log.model";

@Injectable()
export class AmbulanceVehiclesRepository {
  constructor(
    @InjectModel(AmbulanceVehicle)
    private vehicleModel: typeof AmbulanceVehicle,
    @InjectModel(AmbulanceVehicleHistoryLog)
    private ambulanceVehicleHistoryLogModel: typeof AmbulanceVehicleHistoryLog,
  ) { }

  public async getVehicles() {
    return this.vehicleModel.findAll();
  }

  public addAfterCreateHookForHistoryLog(name: string, fn: (instance: AmbulanceVehicleHistoryLog) => void) {
    this.ambulanceVehicleHistoryLogModel.addHook("afterCreate", name, fn);
  }

  public removeAfterCreateHookForHistoryLog(name: string) {
    this.ambulanceVehicleHistoryLogModel.removeHook(
      'afterCreate',
      name,
    );
  }
}
