import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalRepository } from './goal.repository';
import { IntakeRepository } from '../intake/intake.repository';
import { GoalStatus } from './enums/status.enum';
import { Goal } from './entities/goal.entity';
import { UpdateGoalStatusDto } from './dto/update-goal-status.dto';

const MIN_WEEKLY_RATE = 0.5;
const MAX_WEEKLY_RATE = 1.0;
const SUGGESTED_RATE = 0.75; // midpoint, used only when suggesting a realistic date
@Injectable()
export class GoalsService {
  constructor(
    private readonly goalRepository: GoalRepository,
    private readonly intakeRepository: IntakeRepository,
  ) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    // 1. Need current weight from intake — can't set a goal before intake exists
    const intake = await this.intakeRepository.findByUserId(userId);
    if (!intake) {
      throw new NotFoundException('Intake not found for user');
    }
    const currentWeight = Number(intake.weight);
    const targetWeight = createGoalDto.targetWeight;

    // 2. Only one active goal at a time
    const existingActive = await this.goalRepository.findByUserId({
      userId,
      status: GoalStatus.ACTIVE,
    });
    if (existingActive) {
      throw new ConflictException(
        'An active goal already exists. Mark it achieved or abandoned before setting a new one.',
      );
    }

    // 3. Must actually be a weight-loss goal
    if (targetWeight >= currentWeight) {
      throw new BadRequestException(
        'Target weight must be lower than your current weight. FitTrack supports weight-loss goals only.',
      );
    }

    // 4. Weeks between today and target date
    const today = new Date();
    const targetDate = new Date(createGoalDto.targetDate);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeks = (targetDate.getTime() - today.getTime()) / msPerWeek;

    if (weeks < 1) {
      throw new BadRequestException(
        'Target date must be at least one week from today.',
      );
    }

    // 5. Required weekly loss rate to hit that target by that date
    const weightToLose = currentWeight - targetWeight;
    const requiredRate = weightToLose / weeks;
    const roundedRate = Math.round(requiredRate * 100) / 100;

    // 6. Safety check — reject unsafe rate, suggest a realistic date instead
    if (roundedRate < MIN_WEEKLY_RATE || roundedRate > MAX_WEEKLY_RATE) {
      const suggestedWeeks = Math.ceil(weightToLose / SUGGESTED_RATE);
      const suggestedDate = new Date(today);
      suggestedDate.setDate(suggestedDate.getDate() + suggestedWeeks * 7);

      throw new BadRequestException({
        message:
          roundedRate > MAX_WEEKLY_RATE
            ? `That target requires losing ${roundedRate}kg/week, which is unsafe. Maximum sustainable rate is ${MAX_WEEKLY_RATE}kg/week. Suggested target date: ${suggestedDate.toISOString().split('T')[0]}. Suggested weekly loss rate: ${SUGGESTED_RATE}kg/week.`
            : `That target only requires ${roundedRate}kg/week, which is below our minimum tracked rate of ${MIN_WEEKLY_RATE}kg/week — consider a nearer date. Suggested target date: ${suggestedDate.toISOString().split('T')[0]}. Suggested weekly loss rate: ${SUGGESTED_RATE}kg/week.`,
      });
    }

    // 7. Safe — create the goal
    return this.goalRepository.create({
      userId,
      targetWeight,
      targetDate: createGoalDto.targetDate as unknown as Date, // DATEONLY accepts the string directly
      weeklyLossRate: roundedRate,
      status: GoalStatus.ACTIVE,
    } as Goal);
  }

  async findActive(userId: string) {
    const activeGoal = await this.goalRepository.findByUserId({
      userId,
      status: GoalStatus.ACTIVE,
    });
    if (!activeGoal) {
      throw new NotFoundException('No active goal found. Submit goal first.');
    }
    return activeGoal;
  }

  async updateStatus(userId: string, goalId: string, dto: UpdateGoalStatusDto) {
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundException('Goal not found.');
    }
    if (goal.userId !== userId) {
      throw new ForbiddenException('You can only update your own goals.');
    }
    if (goal.status !== GoalStatus.ACTIVE) {
      throw new ConflictException(
        `Goal is already marked as ${goal.status} and cannot be changed.`,
      );
    }

    return goal.update({ status: dto.status });
  }
}
