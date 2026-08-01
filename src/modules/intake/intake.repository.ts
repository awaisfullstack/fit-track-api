import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Intake } from './entities/intake.entity';

@Injectable()
export class IntakeRepository {
  constructor(
    @InjectModel(Intake)
    private readonly intakeModel: typeof Intake,
  ) {}

  async create(data: Intake) {
    return this.intakeModel.create(data);
  }

  async findByUserId(userId: string) {
    return this.intakeModel.findOne({ where: { userId } });
  }
}
