import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { GISMedicalSeeder } from '../app/modules/seeders/services/gis-medical.seeder';
import { AppModule } from '../app/app.module';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
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
