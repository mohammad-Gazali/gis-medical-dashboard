import { Table, Model, DataType, Column } from 'sequelize-typescript';
import { MedicalFacilityType } from '../enums/medical-faclitiy-type.enum';
import { GeoPoint } from '../types/geo-point.type';

@Table({ tableName: 'medical_facilities' })
export class MedicalFacility extends Model {
  @Column(DataType.TEXT)
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(MedicalFacilityType)),
    allowNull: false,
  })
  type: MedicalFacilityType;

  @Column(DataType.GEOGRAPHY('POINT', 4326))
  position: GeoPoint;

  @Column({
    type: DataType.INTEGER,
    field: 'total_beds',
  })
  totalBeds: number;

  @Column({
    type: DataType.INTEGER,
    field: 'available_beds',
  })
  availableBeds: number;
}
