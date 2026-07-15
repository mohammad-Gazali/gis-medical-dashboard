import { Module } from '@nestjs/common';
import { GISMedicalGateway } from './gis-medical.gateway';
import { GISMedicalController } from './gis-medical.controller';
import { GisMedicalService } from './gis-medical.service';

@Module({
  providers: [GISMedicalGateway, GisMedicalService],
  controllers: [GISMedicalController],
})
export class GISMedicalModule {}
