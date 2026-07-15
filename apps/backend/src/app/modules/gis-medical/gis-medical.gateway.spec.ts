import { Test, TestingModule } from '@nestjs/testing';
import { GISMedicalGateway } from './gis-medical.gateway';

describe('GISMedicalGateway', () => {
  let gateway: GISMedicalGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GISMedicalGateway],
    }).compile();

    gateway = module.get<GISMedicalGateway>(GISMedicalGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
