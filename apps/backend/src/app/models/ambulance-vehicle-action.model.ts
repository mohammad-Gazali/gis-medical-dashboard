import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AmbulanceVehicle } from "./ambulance-vehicle.model";

@Table({
  tableName: 'ambulance_vehicles_actions'
})
export class AmbulanceVehicleAction extends Model {
  @ForeignKey(() => AmbulanceVehicle)
  @Column({
    type: DataType.INTEGER,
    field: 'vehicle_id',
  })
  vehicleId: number;

  @BelongsTo(() => AmbulanceVehicle)
  vehicle: AmbulanceVehicle;

  @Column(DataType.TEXT)
  command: string;
}
