import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GISMedicalModule } from './modules/gis-medical/gis-medical.module';
import { SeedersModule } from './modules/seeders/seeders.module';

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
        dialectModule: require('pg'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl: configService.get<string>('DEBUG') !== 'true',
        autoLoadModels: true,
        synchronize: configService.get<string>('DEBUG') === 'true',

        define: {
          timestamps: true,       // Enables createdAt and updatedAt
          underscored: true,      // Converts camelCase to snake_case in the DB (created_at)
        }
      }),
    }),

    // Project modules
    GISMedicalModule,
    SeedersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
