import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalFacility } from '../../../models/medical-facility.model';
import { MedicalFacilityHistoryLog } from '../../../models/medical-facility-history-log.model';
import { col, fn, literal } from 'sequelize';

@Injectable()
export class MedicalFacilitiesRepository {
  constructor(
    @InjectModel(MedicalFacility)
    private facilityModel: typeof MedicalFacility,
    @InjectModel(MedicalFacilityHistoryLog)
    private medicalFacilityHistoryLogModel: typeof MedicalFacilityHistoryLog,
  ) {}

  async findAll() {
    return this.facilityModel.findAll();
  }

  async updateAvailableBeds(id: number, availableBeds: number) {
    await this.facilityModel.update({ availableBeds }, { where: { id } });
  }

  async createHistoryLog(
    medicalFacilityId: number,
    availableBedsState: number,
  ) {
    await this.medicalFacilityHistoryLogModel.create({
      medicalFacilityId,
      availableBedsState,
    });
  }

  public addAfterCreateHookForHistoryLog(
    name: string,
    fn: (instance: MedicalFacilityHistoryLog) => void,
  ) {
    this.medicalFacilityHistoryLogModel.addHook('afterCreate', name, fn);
  }

  public removeAfterCreateHookForHistoryLog(name: string) {
    this.medicalFacilityHistoryLogModel.removeHook('afterCreate', name);
  }

  async findNearestFacility(longitude: number, latitude: number) {
    return this.facilityModel.findOne({
      attributes: {
        include: [
          [
            fn(
              'ST_Distance',
              col('position'),
              literal(
                `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`,
              ),
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
      limit: 1,
    });
  }

  async findNearbyFacilities(
    longitude: number,
    latitude: number,
    radiusMeters: number,
  ) {
    return this.facilityModel.findAll({
      where: literal(
        `ST_DWithin(position::geography, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${radiusMeters})`,
      ),
      attributes: {
        include: [
          [
            fn(
              'ST_Distance',
              col('position'),
              literal(
                `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`,
              ),
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
    });
  }
}
