import { Test, TestingModule } from '@nestjs/testing';
import { IntakeController } from './intake.controller';
import { IntakeService } from './intake.service';

describe('IntakeController', () => {
  let controller: IntakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntakeController],
      providers: [IntakeService],
    }).compile();

    controller = module.get<IntakeController>(IntakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
