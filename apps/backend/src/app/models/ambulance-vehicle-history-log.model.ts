import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AmbulanceVehicle } from './ambulance-vehicle.model';
import { GeoPoint } from '@gis-medical/shared';

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

  @Column({
    type: DataType.GEOGRAPHY('POINT', 4326),
    field: 'location_state',
  })
  locationState: GeoPoint;

  @Column(DataType.TEXT)
  numbers: string;
}
