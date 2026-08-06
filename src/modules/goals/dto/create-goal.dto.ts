import { IsDateString, IsNumber, Min, Max } from 'class-validator';

export class CreateGoalDto {
  @IsNumber()
  @Min(20, { message: 'Target weight must be at least 20kg' })
  @Max(300)
  targetWeight!: number;

  @IsDateString()
  targetDate!: string; // ISO date string, e.g. "2026-12-01"
}
