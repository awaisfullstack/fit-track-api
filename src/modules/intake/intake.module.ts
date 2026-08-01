import { Module } from '@nestjs/common';
import { IntakeService } from './intake.service';
import { IntakeController } from './intake.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Intake } from './entities/intake.entity';
import { IntakeRepository } from './intake.repository';

@Module({
  imports: [SequelizeModule.forFeature([Intake])],
  controllers: [IntakeController],
  providers: [IntakeService, IntakeRepository],
  exports: [IntakeService, IntakeRepository],
})
export class IntakeModule {}
