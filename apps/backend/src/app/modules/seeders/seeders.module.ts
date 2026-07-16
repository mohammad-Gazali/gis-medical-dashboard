import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AmbulanceVehicle } from "../../models/ambulance-vehicle.model";
import { MedicalFacility } from "../../models/medical-facility.model";
import { GISMedicalSeeder } from "./services/gis-medical.seeder";

@Module({
  imports: [
    SequelizeModule.forFeature([
      AmbulanceVehicle,
      MedicalFacility,
    ])
  ],
  providers: [
    GISMedicalSeeder,
  ]
})
export class SeedersModule { }
