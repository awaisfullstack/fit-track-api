import { Test, TestingModule } from '@nestjs/testing';
import { PlanEngineService } from './plan-engine.service';

describe('PlanEngineService', () => {
  let service: PlanEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanEngineService],
    }).compile();

    service = module.get<PlanEngineService>(PlanEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
