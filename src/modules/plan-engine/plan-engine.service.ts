import { Injectable } from '@nestjs/common';
import { CreatePlanEngineDto } from './dto/create-plan-engine.dto';
import { UpdatePlanEngineDto } from './dto/update-plan-engine.dto';

@Injectable()
export class PlanEngineService {
  create(createPlanEngineDto: CreatePlanEngineDto) {
    return 'This action adds a new planEngine';
  }

  findAll() {
    return `This action returns all planEngine`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planEngine`;
  }

  update(id: number, updatePlanEngineDto: UpdatePlanEngineDto) {
    return `This action updates a #${id} planEngine`;
  }

  remove(id: number) {
    return `This action removes a #${id} planEngine`;
  }
}
