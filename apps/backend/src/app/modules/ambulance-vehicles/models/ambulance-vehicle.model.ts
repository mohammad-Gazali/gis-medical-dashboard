import { Column, DataType, Model, Table } from "sequelize-typescript";
import { GeoPoint } from "../../../shared/types/geo-point.type";

@Table({
  tableName: 'ambulance_vehicles'
})
export class AmbulanceVehicle extends Model {
  @Column({
    type: DataType.TEXT,
    field: 'plate_number'
  })
  plateNumber: string;

  @Column(DataType.GEOGRAPHY('POINT', 4326))
  location: GeoPoint;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_busy'
  })
  isBusy: boolean;
}
