import { Table, Model, DataType, Column } from 'sequelize-typescript';
import { GeoPoint, MedicalFacilityType } from '@gis-medical/shared';

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
