import {
  IsInt,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { SEX } from '../enums/sex.enum';
import { UnitPreference } from '../enums/unit-preference.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { DietaryPreference } from '../enums/dietary-preference.enum';

export class CreateIntakeDto {
  @IsInt()
  @Min(13, { message: 'Must be at least 13 years old' })
  @Max(100)
  age!: number;

  @IsNumber()
  @Min(100, { message: 'Height must be at least 100cm' })
  @Max(250)
  height!: number;

  @IsNumber()
  @Min(30, { message: 'Weight must be at least 30kg' })
  @Max(300)
  weight!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @IsNumber()
  @Min(0)
  @Max(24)
  sleepHours!: number;

  @IsEnum(SEX)
  sex!: SEX;

  @IsEnum(ActivityLevel)
  activityLevel!: ActivityLevel;

  @IsOptional()
  @IsEnum(UnitPreference)
  unitPreference?: UnitPreference; // defaults to METRIC at the entity level if omitted

  @IsEnum(DietaryPreference)
  dietaryPreference!: DietaryPreference;

  @IsBoolean()
  hasHypertension!: boolean;

  @IsBoolean()
  hasDiabetes!: boolean;

  @IsBoolean()
  hasJointIssues!: boolean;

  @IsBoolean()
  isPregnant!: boolean;
}
