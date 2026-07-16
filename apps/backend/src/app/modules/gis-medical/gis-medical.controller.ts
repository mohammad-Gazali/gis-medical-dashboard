import { Controller, Get, Post, Query } from '@nestjs/common';
import { GisMedicalService, SimulationService } from './services';
import { SimulationStatusResponse } from '@gis-medical/shared';

@Controller('gis-medical')
export class GISMedicalController {
  constructor(
    private readonly gisMedicalService: GisMedicalService,
    private readonly simulationService: SimulationService,
  ) {}

  @Get()
  async getEntities(@Query('datetime') datetime?: string) {
    return this.gisMedicalService.getAllEntities();
  }

  @Post('simulation/start')
  async startSimulation(): Promise<SimulationStatusResponse> {
    await this.simulationService.start();
    return { running: true };
  }

  @Post('simulation/stop')
  stopSimulation(): SimulationStatusResponse {
    this.simulationService.stop();
    return { running: false };
  }

  @Get('simulation/status')
  getSimulationStatus(): SimulationStatusResponse {
    return { running: this.simulationService.isRunning };
  }
}
