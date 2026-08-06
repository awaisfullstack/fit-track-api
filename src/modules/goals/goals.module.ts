import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Goal } from './entities/goal.entity';
import { IntakeModule } from '../intake/intake.module';
import { GoalRepository } from './goal.repository';

@Module({
  imports: [SequelizeModule.forFeature([Goal]), IntakeModule],
  controllers: [GoalsController],
  providers: [GoalsService, GoalRepository],
  exports: [GoalsService, GoalRepository],
})
export class GoalsModule {}
