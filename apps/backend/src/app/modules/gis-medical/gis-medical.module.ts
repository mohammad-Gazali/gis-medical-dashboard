import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GISMedicalGateway } from './gis-medical.gateway';
import { GISMedicalController } from './gis-medical.controller';
import { GisMedicalService, SimulationService } from './services';
import { AmbulanceVehicle } from '../../models/ambulance-vehicle.model';
import { AmbulanceVehicleAction } from '../../models/ambulance-vehicle-action.model';
import { AmbulanceVehicleHistoryLog } from '../../models/ambulance-vehicle-history-log.model';
import { MedicalFacility } from '../../models/medical-facility.model';
import { MedicalFacilityHistoryLog } from '../../models/medical-facility-history-log.model';
import { AmbulanceVehiclesRepository } from './repositories/ambulance-vehicles.repository';
import { MedicalFacilitiesRepository } from './repositories/medical-facilities.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AmbulanceVehicle,
      AmbulanceVehicleAction,
      AmbulanceVehicleHistoryLog,
      MedicalFacility,
      MedicalFacilityHistoryLog,
    ]),
  ],
  providers: [
    GISMedicalGateway,
    GisMedicalService,
    SimulationService,
    AmbulanceVehiclesRepository,
    MedicalFacilitiesRepository,
  ],
  controllers: [GISMedicalController],
})
export class GISMedicalModule {}
