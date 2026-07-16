import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GISMedicalSeeder } from './services/gis-medical.seeder';
import { AmbulanceVehicle } from '../../models/ambulance-vehicle.model';
import { MedicalFacility } from '../../models/medical-facility.model';
import { AmbulanceVehicleHistoryLog } from '../../models/ambulance-vehicle-history-log.model';
import { MedicalFacilityHistoryLog } from '../../models/medical-facility-history-log.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AmbulanceVehicle,
      MedicalFacility,
      AmbulanceVehicleHistoryLog,
      MedicalFacilityHistoryLog,
    ]),
  ],
  providers: [GISMedicalSeeder],
})
export class SeedersModule {}
