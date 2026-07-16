import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedersModule } from '../app/modules/seeders/seeders.module';
import { GISMedicalSeeder } from '../app/modules/seeders/services/gis-medical.seeder';

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedersModule);
  const gisMedicalSeeder = app.get(GISMedicalSeeder);
  const logger = new Logger('Seed');

  try {
    logger.log('Starting seed...');
    const { facilities, vehicles } = await gisMedicalSeeder.seed();
    logger.log(`Seed complete: ${facilities} facilities, ${vehicles} vehicles`);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

seed();
