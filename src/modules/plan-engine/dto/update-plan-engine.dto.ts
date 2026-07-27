import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanEngineDto } from './create-plan-engine.dto';

export class UpdatePlanEngineDto extends PartialType(CreatePlanEngineDto) {}
