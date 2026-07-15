import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AmbulanceVehicle } from './ambulance-vehicle.model';

@Table({
  tableName: 'ambulance_vehicles_history_logs',
})
export class AmbulanceVehicleHistoryLog extends Model {
  @ForeignKey(() => AmbulanceVehicle)
  @Column({
    type: DataType.INTEGER,
    field: 'vehicle_id',
  })
  vehicleId: number;

  @BelongsTo(() => AmbulanceVehicle)
  vehicle: AmbulanceVehicle;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_busy_state',
  })
  isBusyState: boolean;
}
