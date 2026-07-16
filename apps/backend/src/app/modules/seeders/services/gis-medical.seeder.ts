import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GeoPoint, MedicalFacilityType } from '@gis-medical/shared';
import { MedicalFacility } from '../../../models/medical-facility.model';
import { AmbulanceVehicle } from '../../../models/ambulance-vehicle.model';

interface FacilitySeed {
  name: string;
  type: MedicalFacilityType;
  coordinates: [number, number];
  totalBeds: number;
}

const FACILITIES: FacilitySeed[] = [
  { name: 'مشفى دمشق المركزي', type: MedicalFacilityType.HOSPITAL, coordinates: [36.2765, 33.5138], totalBeds: 500 },
  { name: 'مشفى الأسد الجامعي', type: MedicalFacilityType.HOSPITAL, coordinates: [36.2930, 33.5080], totalBeds: 600 },
  { name: 'مستشفى الشميسي', type: MedicalFacilityType.HOSPITAL, coordinates: [36.2800, 33.5200], totalBeds: 200 },
  { name: 'عيادة المزة', type: MedicalFacilityType.CLINIC, coordinates: [36.2650, 33.5300], totalBeds: 50 },
  { name: 'عيادة كفر سوسة', type: MedicalFacilityType.CLINIC, coordinates: [36.3000, 33.5050], totalBeds: 40 },
  { name: 'نقطة إسعاف ميدانية - برزة', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.2500, 33.5400], totalBeds: 20 },
  { name: 'نقطة إسعاف ميدانية - الميدان', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.2900, 33.4900], totalBeds: 15 },

  { name: 'مشفى حلب الأهلية', type: MedicalFacilityType.HOSPITAL, coordinates: [37.1613, 36.2283], totalBeds: 450 },
  { name: 'مستشفى جامعة حلب', type: MedicalFacilityType.HOSPITAL, coordinates: [37.1500, 36.2350], totalBeds: 550 },
  { name: 'مستشفى الرازي', type: MedicalFacilityType.HOSPITAL, coordinates: [37.1700, 36.2200], totalBeds: 300 },
  { name: 'عيادة الشيخ مقصود', type: MedicalFacilityType.CLINIC, coordinates: [37.1450, 36.2400], totalBeds: 60 },
  { name: 'عيادة الصاخور', type: MedicalFacilityType.CLINIC, coordinates: [37.1800, 36.2100], totalBeds: 45 },
  { name: 'نقطة إسعاف ميدانية - باب Анطونية', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [37.1300, 36.2500], totalBeds: 25 },
  { name: 'نقطة إسعاف ميدانية - حلب القديمة', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [37.1600, 36.2300], totalBeds: 18 },

  { name: 'مشفى الحسون', type: MedicalFacilityType.HOSPITAL, coordinates: [36.7134, 34.7330], totalBeds: 400 },
  { name: 'مستشفى الباسل', type: MedicalFacilityType.HOSPITAL, coordinates: [36.7200, 34.7250], totalBeds: 350 },
  { name: 'عيادة الخالدية', type: MedicalFacilityType.CLINIC, coordinates: [36.7000, 34.7400], totalBeds: 55 },
  { name: 'عيادة حي النزهة', type: MedicalFacilityType.CLINIC, coordinates: [36.7300, 34.7200], totalBeds: 40 },
  { name: 'نقطة إسعاف ميدانية - وسط المدينة', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.7100, 34.7350], totalBeds: 20 },

  { name: 'مشفى حماه الوطني', type: MedicalFacilityType.HOSPITAL, coordinates: [36.7537, 35.1298], totalBeds: 380 },
  { name: 'مستشفى القلب', type: MedicalFacilityType.HOSPITAL, coordinates: [36.7600, 35.1200], totalBeds: 250 },
  { name: 'عيادة حي الورود', type: MedicalFacilityType.CLINIC, coordinates: [36.7450, 35.1350], totalBeds: 45 },
  { name: 'نقطة إسعاف ميدانية - ساحة الجAMIL', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.7500, 35.1300], totalBeds: 15 },

  { name: 'مشفى الاسكندرانة', type: MedicalFacilityType.HOSPITAL, coordinates: [35.9300, 35.3600], totalBeds: 320 },
  { name: 'مستشفى الحمدانية', type: MedicalFacilityType.HOSPITAL, coordinates: [35.9200, 35.3700], totalBeds: 280 },
  { name: 'عيادة ب STORAGE', type: MedicalFacilityType.CLINIC, coordinates: [35.9400, 35.3550], totalBeds: 50 },
  { name: 'نقطة إسعاف ميدانية - اللاذقية', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [35.9350, 35.3650], totalBeds: 20 },

  { name: 'مشفى دير الزور الوطني', type: MedicalFacilityType.HOSPITAL, coordinates: [40.1481, 35.3359], totalBeds: 300 },
  { name: 'عيادة الفرات', type: MedicalFacilityType.CLINIC, coordinates: [40.1550, 35.3300], totalBeds: 40 },
  { name: 'نقطة إسعاف ميدانية - دير الزور', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [40.1450, 35.3400], totalBeds: 15 },

  { name: 'مشفى الرقة', type: MedicalFacilityType.HOSPITAL, coordinates: [39.0093, 35.9483], totalBeds: 250 },
  { name: 'عيادة الرقة الجديدة', type: MedicalFacilityType.CLINIC, coordinates: [39.0150, 35.9450], totalBeds: 35 },
  { name: 'نقطة إسعاف ميدانية - الرقة', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [39.0050, 35.9500], totalBeds: 12 },

  { name: 'مشفى الحسكة', type: MedicalFacilityType.HOSPITAL, coordinates: [40.7527, 36.5103], totalBeds: 280 },
  { name: 'عيادة الكTruthy', type: MedicalFacilityType.CLINIC, coordinates: [40.7600, 36.5050], totalBeds: 30 },
  { name: 'نقطة إسعاف ميدانية - الحسكة', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [40.7450, 36.5150], totalBeds: 10 },

  { name: 'مشفى درعا', type: MedicalFacilityType.HOSPITAL, coordinates: [36.1030, 32.6189], totalBeds: 220 },
  { name: 'عيادة درعا البلد', type: MedicalFacilityType.CLINIC, coordinates: [36.1100, 32.6150], totalBeds: 35 },
  { name: 'نقطة إسعاف ميدانية - درعا', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.1000, 32.6200], totalBeds: 12 },

  { name: 'مشفى إدلب', type: MedicalFacilityType.HOSPITAL, coordinates: [36.5350, 35.9286], totalBeds: 200 },
  { name: 'عيادة إدلب المركزية', type: MedicalFacilityType.CLINIC, coordinates: [36.5400, 35.9250], totalBeds: 30 },
  { name: 'نقطة إسعاف ميدانية - إدلب', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [36.5300, 35.9300], totalBeds: 10 },

  { name: 'مشفى طرطوس', type: MedicalFacilityType.HOSPITAL, coordinates: [35.8847, 34.8864], totalBeds: 260 },
  { name: 'عيادة طرطوس', type: MedicalFacilityType.CLINIC, coordinates: [35.8900, 34.8850], totalBeds: 40 },
  { name: 'نقطة إسعاف ميدانية - طرطوس', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [35.8800, 34.8900], totalBeds: 15 },

  { name: 'مشفى القامشلي', type: MedicalFacilityType.HOSPITAL, coordinates: [40.8287, 37.0458], totalBeds: 240 },
  { name: 'عيادة القامشلي', type: MedicalFacilityType.CLINIC, coordinates: [40.8350, 37.0400], totalBeds: 30 },
  { name: 'نقطة إسعاف ميدانية - القامشلي', type: MedicalFacilityType.FIELD_MEDICAL_STATION, coordinates: [40.8250, 37.0500], totalBeds: 10 },
];

const VEHICLE_PREFIXES = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];


@Injectable()
export class GISMedicalSeeder {
  private readonly logger = new Logger(GISMedicalSeeder.name);

  constructor(
    @InjectModel(MedicalFacility)
    private facilityModel: typeof MedicalFacility,
    @InjectModel(AmbulanceVehicle)
    private vehicleModel: typeof AmbulanceVehicle,
  ) {}

  async seed(): Promise<{ facilities: number; vehicles: number }> {
    this.logger.log('Starting database seed...');

    await this.vehicleModel.destroy({ where: {} });
    await this.facilityModel.destroy({ where: {} });

    const createdFacilities = await this.seedFacilities();
    const createdVehicles = await this.seedVehicles(createdFacilities);

    this.logger.log(`Seed complete: ${createdFacilities.length} facilities, ${createdVehicles.length} vehicles`);

    return {
      facilities: createdFacilities.length,
      vehicles: createdVehicles.length,
    };
  }

  private async seedFacilities(): Promise<MedicalFacility[]> {
    const facilities: MedicalFacility[] = [];

    for (const seed of FACILITIES) {
      const facility = await this.facilityModel.create({
        name: seed.name,
        type: seed.type,
        position: {
          type: 'Point',
          coordinates: seed.coordinates,
        } as GeoPoint,
        totalBeds: seed.totalBeds,
        availableBeds: Math.floor(seed.totalBeds * (0.2 + Math.random() * 0.6)),
      });
      facilities.push(facility);
    }

    this.logger.log(`Created ${facilities.length} medical facilities`);
    return facilities;
  }

  private async seedVehicles(facilities: MedicalFacility[]): Promise<AmbulanceVehicle[]> {
    const vehicles: AmbulanceVehicle[] = [];
    const vehiclesPerCity = 3;

    const cityFacilities = new Map<string, MedicalFacility[]>();
    for (const facility of facilities) {
      const name = facility.name;
      const city = name.replace(/^(مشفى|مستشفى|عيادة|نقطة إسعاف ميدانية)\s+/, '').split(' - ')[0].split(' ')[0];
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
        const coords = (baseFacility.position as unknown as GeoPoint).coordinates;

        const plateNumber = this.generatePlateNumber();

        const vehicle = await this.vehicleModel.create({
          plateNumber,
          location: {
            type: 'Point',
            coordinates: [
              coords[0] + (Math.random() - 0.5) * 0.01,
              coords[1] + (Math.random() - 0.5) * 0.01,
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
    const prefix = VEHICLE_PREFIXES[Math.floor(Math.random() * VEHICLE_PREFIXES.length)];
    const number = String(Math.floor(10000 + Math.random() * 90000));
    const suffix = VEHICLE_PREFIXES[Math.floor(Math.random() * VEHICLE_PREFIXES.length)];
    return `${prefix} ${number} ${suffix}`;
  }
}
