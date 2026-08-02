import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/types/auth.types';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { UpdateGoalStatusDto } from './dto/update-goal-status.dto';

@UseGuards(JwtAccessGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(user.id, dto);
  }

  @Get()
  findActive(@CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.findActive(user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateGoalStatusDto,
  ) {
    return this.goalsService.updateStatus(user.id, id, dto);
  }
}
