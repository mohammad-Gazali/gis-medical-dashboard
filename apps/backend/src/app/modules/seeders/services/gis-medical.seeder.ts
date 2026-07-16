import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GeoPoint, MedicalFacilityType } from '@gis-medical/shared';
import { MedicalFacility } from '../../../models/medical-facility.model';
import { AmbulanceVehicle } from '../../../models/ambulance-vehicle.model';
import { MedicalFacilityHistoryLog } from '../../../models/medical-facility-history-log.model';
import { AmbulanceVehicleHistoryLog } from '../../../models/ambulance-vehicle-history-log.model';

interface Governorate {
  name: string;
  center: [number, number];
  radius: number;
}

const GOVERNORATES: Governorate[] = [
  { name: 'دمشق', center: [36.2765, 33.5138], radius: 0.15 },
  { name: 'ريف دمشق', center: [36.4, 33.45], radius: 0.25 },
  { name: 'حلب', center: [37.1613, 36.2283], radius: 0.2 },
  { name: 'حمص', center: [36.7134, 34.733], radius: 0.18 },
  { name: 'حماة', center: [36.7537, 35.1298], radius: 0.15 },
  { name: 'اللاذقية', center: [35.93, 35.36], radius: 0.12 },
  { name: 'طرطوس', center: [35.8847, 34.8864], radius: 0.12 },
  { name: 'إدلب', center: [36.535, 35.9286], radius: 0.15 },
  { name: 'دير الزور', center: [40.1481, 35.3359], radius: 0.15 },
  { name: 'الرقة', center: [39.0093, 35.9483], radius: 0.15 },
  { name: 'الحسكة', center: [40.7527, 36.5103], radius: 0.2 },
  { name: 'درعا', center: [36.103, 32.6189], radius: 0.15 },
  { name: 'السويداء', center: [36.08, 32.71], radius: 0.12 },
  { name: 'القنيطرة', center: [35.82, 33.13], radius: 0.1 },
];

const FACILITY_TEMPLATES: {
  suffix: string;
  type: MedicalFacilityType;
  bedRange: [number, number];
}[] = [
  {
    suffix: 'المركزي',
    type: MedicalFacilityType.HOSPITAL,
    bedRange: [300, 600],
  },
  {
    suffix: 'الجامعي',
    type: MedicalFacilityType.HOSPITAL,
    bedRange: [400, 700],
  },
  {
    suffix: 'الأهلي',
    type: MedicalFacilityType.HOSPITAL,
    bedRange: [200, 450],
  },
  { suffix: 'الصحة', type: MedicalFacilityType.CLINIC, bedRange: [30, 80] },
  { suffix: 'النزهة', type: MedicalFacilityType.CLINIC, bedRange: [25, 60] },
  { suffix: 'الروضة', type: MedicalFacilityType.CLINIC, bedRange: [20, 50] },
  {
    suffix: 'الميدانية الأولى',
    type: MedicalFacilityType.FIELD_MEDICAL_STATION,
    bedRange: [10, 25],
  },
  {
    suffix: 'الميدانية الثانية',
    type: MedicalFacilityType.FIELD_MEDICAL_STATION,
    bedRange: [8, 20],
  },
];

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomPointInCircle(
  center: [number, number],
  radius: number,
): [number, number] {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.random()) * radius;
  return [center[0] + r * Math.cos(angle), center[1] + r * Math.sin(angle)];
}

@Injectable()
export class GISMedicalSeeder {
  private readonly logger = new Logger(GISMedicalSeeder.name);

  constructor(
    @InjectModel(MedicalFacility)
    private facilityModel: typeof MedicalFacility,
    @InjectModel(AmbulanceVehicle)
    private vehicleModel: typeof AmbulanceVehicle,
    @InjectModel(MedicalFacilityHistoryLog)
    private facilityHistoryLogModel: typeof MedicalFacilityHistoryLog,
    @InjectModel(AmbulanceVehicleHistoryLog)
    private vehicleHistoryLogModel: typeof AmbulanceVehicleHistoryLog,
  ) {}

  async seed(): Promise<{ facilities: number; vehicles: number }> {
    this.logger.log('Starting database seed...');

    await this.vehicleHistoryLogModel.destroy({ where: {} });
    await this.facilityHistoryLogModel.destroy({ where: {} });
    await this.vehicleModel.destroy({ where: {} });
    await this.facilityModel.destroy({ where: {} });

    const createdFacilities = await this.seedFacilities();
    const createdVehicles = await this.seedVehicles(createdFacilities);

    this.logger.log(
      `Seed complete: ${createdFacilities.length} facilities, ${createdVehicles.length} vehicles`,
    );

    return {
      facilities: createdFacilities.length,
      vehicles: createdVehicles.length,
    };
  }

  private async seedFacilities(): Promise<MedicalFacility[]> {
    const facilities: MedicalFacility[] = [];

    for (const gov of GOVERNORATES) {
      for (const template of FACILITY_TEMPLATES) {
        const coords = randomPointInCircle(gov.center, gov.radius);
        const totalBeds = Math.floor(
          randomInRange(template.bedRange[0], template.bedRange[1]),
        );
        const facility = await this.facilityModel.create({
          name: `${gov.name} - ${template.suffix}`,
          type: template.type,
          position: {
            type: 'Point',
            coordinates: coords,
          } as GeoPoint,
          totalBeds,
          availableBeds: Math.floor(totalBeds * (0.2 + Math.random() * 0.6)),
        });
        facilities.push(facility);
      }
    }

    this.logger.log(`Created ${facilities.length} medical facilities`);
    return facilities;
  }

  private async seedVehicles(
    facilities: MedicalFacility[],
  ): Promise<AmbulanceVehicle[]> {
    const vehicles: AmbulanceVehicle[] = [];
    const vehiclesPerCity = 3;

    const cityFacilities = new Map<string, MedicalFacility[]>();
    for (const facility of facilities) {
      const city = facility.name.split(' - ')[0];
      const existing = cityFacilities.get(city);
      if (existing) {
        existing.push(facility);
      } else {
        cityFacilities.set(city, [facility]);
      }
    }

    for (const [, cityFacilityList] of cityFacilities) {
      for (let i = 0; i < vehiclesPerCity; i++) {
        const baseFacility = cityFacilityList[i % cityFacilityList.length];
        const coords = (baseFacility.position as unknown as GeoPoint)
          .coordinates;

        const plateNumber = this.generatePlateNumber();
        const spread = 0.03;

        const vehicle = await this.vehicleModel.create({
          plateNumber,
          location: {
            type: 'Point',
            coordinates: [
              coords[0] + (Math.random() - 0.5) * spread * 2,
              coords[1] + (Math.random() - 0.5) * spread * 2,
            ],
          } as GeoPoint,
          isBusy: Math.random() > 0.7,
        });
        vehicles.push(vehicle);
      }
    }

    this.logger.log(`Created ${vehicles.length} ambulance vehicles`);
    return vehicles;
  }

  private generatePlateNumber(): string {
    const prefixes = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = String(Math.floor(10000 + Math.random() * 90000));
    const suffix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${number} ${suffix}`;
  }
}
