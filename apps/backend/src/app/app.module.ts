import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MedicalFacilitiesModule } from './modules/medical-facilities/medical-facilities.module';
import { AmbulanceVehiclesModule } from './modules/ambulance-vehicles/ambulance-vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: configService.get<string>('DEBUG') === 'true',
      }),
    }),

    // Project modules
    MedicalFacilitiesModule,
    AmbulanceVehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
