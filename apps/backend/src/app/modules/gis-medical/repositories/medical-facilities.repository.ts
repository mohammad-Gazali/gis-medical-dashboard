import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalFacility } from '../../../models/medical-facility.model';
import { MedicalFacilityHistoryLog } from '../../../models/medical-facility-history-log.model';
import { col, fn, literal, Op } from 'sequelize';

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
              fn(
                'ST_SetSRID',
                fn('ST_MakePoint', literal(':lon'), literal(':lat')),
                4326,
              ),
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
      limit: 1,
      replacements: { lon: longitude, lat: latitude },
    });
  }

  /**
   * Same as findNearestFacility, but only considers facilities that
   * currently have at least one free bed — used by the simulation/dispatch
   * logic so an ambulance doesn't get routed to an already-full hospital.
   * Falls back to the plain nearest-facility (ignoring capacity) if every
   * facility nearby happens to be full, so the sim never gets stuck.
   */
  async findNearestFacilityWithCapacity(longitude: number, latitude: number) {
    const nearestWithCapacity = await this.facilityModel.findOne({
      where: { availableBeds: { [Op.gt]: 0 } },
      attributes: {
        include: [
          [
            fn(
              'ST_Distance',
              col('position'),
              fn(
                'ST_SetSRID',
                fn('ST_MakePoint', literal(':lon'), literal(':lat')),
                4326,
              ),
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
      limit: 1,
      replacements: { lon: longitude, lat: latitude },
    });

    if (nearestWithCapacity) return nearestWithCapacity;

    return this.findNearestFacility(longitude, latitude);
  }

  async findNearbyFacilities(
    longitude: number,
    latitude: number,
    radiusMeters: number,
  ) {
    return this.facilityModel.findAll({
      where: literal(
        'ST_DWithin(position::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)',
      ),
      attributes: {
        include: [
          [
            fn(
              'ST_Distance',
              col('position'),
              fn(
                'ST_SetSRID',
                fn('ST_MakePoint', literal(':lon'), literal(':lat')),
                4326,
              ),
            ),
            'distance',
          ],
        ],
      },
      order: [[literal('distance'), 'ASC']],
      replacements: { lon: longitude, lat: latitude, radius: radiusMeters },
    });
  }
}
