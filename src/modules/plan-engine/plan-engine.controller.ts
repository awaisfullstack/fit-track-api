import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanEngineService } from './plan-engine.service';
import { CreatePlanEngineDto } from './dto/create-plan-engine.dto';
import { UpdatePlanEngineDto } from './dto/update-plan-engine.dto';

@Controller('plan-engine')
export class PlanEngineController {
  constructor(private readonly planEngineService: PlanEngineService) {}

  @Post()
  create(@Body() createPlanEngineDto: CreatePlanEngineDto) {
    return this.planEngineService.create(createPlanEngineDto);
  }

  @Get()
  findAll() {
    return this.planEngineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planEngineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanEngineDto: UpdatePlanEngineDto) {
    return this.planEngineService.update(+id, updatePlanEngineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planEngineService.remove(+id);
  }
}
