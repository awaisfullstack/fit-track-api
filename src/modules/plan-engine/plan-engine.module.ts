import { Module } from '@nestjs/common';
import { PlanEngineService } from './plan-engine.service';
import { PlanEngineController } from './plan-engine.controller';

@Module({
  controllers: [PlanEngineController],
  providers: [PlanEngineService],
})
export class PlanEngineModule {}
