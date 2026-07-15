import { Test, TestingModule } from '@nestjs/testing';
import { GisMedicalService } from './gis-medical.service';

describe('GisMedicalService', () => {
  let service: GisMedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GisMedicalService],
    }).compile();

    service = module.get<GisMedicalService>(GisMedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
