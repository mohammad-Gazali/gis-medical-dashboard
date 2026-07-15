import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { MedicalFacility } from './medical-facility.model';

@Table({
  tableName: 'medical_facilities_history_logs',
})
export class MedicalFacilityHistoryLog extends Model {
  @ForeignKey(() => MedicalFacility)
  @Column({
    type: DataType.INTEGER,
    field: 'medical_facility_id',
  })
  medicalFacilityId: number;

  @BelongsTo(() => MedicalFacility)
  medicalFacility: MedicalFacility;

  @Column({
    type: DataType.INTEGER,
    field: 'available_beds_state',
  })
  availableBedsState: number;
}
