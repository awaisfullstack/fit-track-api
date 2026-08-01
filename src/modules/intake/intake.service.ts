import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { IntakeRepository } from './intake.repository';
import { SEX } from './enums/sex.enum';
import { BmiBmrResult } from 'src/types/intake.types';
import { Intake } from './entities/intake.entity';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@Injectable()
export class IntakeService {
  constructor(private readonly intakRepository: IntakeRepository) {}
  async create(userId: string, dto: CreateIntakeDto) {
    const existing = await this.intakRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictException('Intake already submitted for this user');
    }
    const { bmi, bmr, summary } = this.calculateBmiBmr(
      dto.weight,
      dto.height,
      dto.age,
      dto.sex,
    );
    const intake = await this.intakRepository.create({
      ...dto,
      bmi,
      bmr,
      userId,
    } as Intake);
    return { ...intake.toJSON(), summary };
  }

  async findByUserId(userId: string) {
    const intake = await this.intakRepository.findByUserId(userId);
    if (!intake) {
      throw new NotFoundException(
        'No intake found for this user. Please create intake first.',
      );
    }
    const { summary } = this.calculateBmiBmr(
      intake.weight,
      intake.height,
      intake.age,
      intake.sex,
    );

    return { ...intake.toJSON(), summary };
  }

  async update(userId: string, dto: UpdateIntakeDto) {
    const existing = await this.intakRepository.findByUserId(userId);
    if (!existing) {
      throw new ConflictException('No intake found for this user');
    }
    const affectsCalc =
      dto.weight !== undefined ||
      dto.height !== undefined ||
      dto.age !== undefined ||
      dto.sex !== undefined;

    const updates: Partial<Intake> = { ...dto };

    if (affectsCalc) {
      const { bmi, bmr } = this.calculateBmiBmr(
        dto.weight ?? existing.weight,
        dto.height ?? existing.height,
        dto.age ?? existing.age,
        dto.sex ?? existing.sex,
      );
      updates.bmi = bmi;
      updates.bmr = bmr;
    }
    await existing.update(updates);
    const { summary } = this.calculateBmiBmr(
      existing.weight,
      existing.height,
      existing.age,
      existing.sex,
    );
    return { ...existing.toJSON(), summary };
  }

  // helpers
  private calculateBmiBmr(
    weightKg: number,
    heightCm: number,
    age: number,
    sex: SEX,
  ): BmiBmrResult {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Mifflin-St Jeor, per spec 3.2
    const bmr =
      sex === SEX.MALE
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const bmiRounded = Math.round(bmi * 10) / 10;
    const bmrRounded = Math.round(bmr * 10) / 10;

    let category: string;
    if (bmiRounded < 18.5) category = 'underweight';
    else if (bmiRounded < 25) category = 'a healthy range';
    else if (bmiRounded < 30) category = 'above the healthy range';
    else category = 'well above the healthy range';

    const summary =
      `Your BMI is ${bmiRounded}, which falls in ${category}. ` +
      `Your body burns roughly ${Math.round(bmrRounded)} calories a day at rest. ` +
      `This is not a diagnosis — consult your physician for personalized medical advice.`;

    return { bmi: bmiRounded, bmr: bmrRounded, summary };
  }
}
