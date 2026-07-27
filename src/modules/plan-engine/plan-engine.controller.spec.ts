import { Test, TestingModule } from '@nestjs/testing';
import { PlanEngineController } from './plan-engine.controller';
import { PlanEngineService } from './plan-engine.service';

describe('PlanEngineController', () => {
  let controller: PlanEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanEngineController],
      providers: [PlanEngineService],
    }).compile();

    controller = module.get<PlanEngineController>(PlanEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
