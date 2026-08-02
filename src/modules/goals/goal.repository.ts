import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Goal } from './entities/goal.entity';
import { GoalStatus } from './enums/status.enum';

@Injectable()
export class GoalRepository {
  constructor(
    @InjectModel(Goal)
    private readonly goalModel: typeof Goal,
  ) {}

  async create(data: Goal) {
    return this.goalModel.create(data);
  }

  async findByUserId(data: Partial<Goal>) {
    return this.goalModel.findOne({ where: data });
  }

  async findById(id: string) {
    return this.goalModel.findByPk(id);
  }
}
