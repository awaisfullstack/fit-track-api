import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IntakeService } from './intake.service';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/types/auth.types';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@UseGuards(JwtAccessGuard)
@Controller('intake')
export class IntakeController {
  constructor(private readonly intakeService: IntakeService) {}

  @Post()
  @ResponseMessage('Intake created successfully')
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createIntakeDto: CreateIntakeDto,
  ) {
    return this.intakeService.create(user.id, createIntakeDto);
  }

  @Get()
  async findOne(@CurrentUser() user: AuthenticatedUser) {
    return await this.intakeService.findByUserId(user.id);
  }

  @Patch()
  @ResponseMessage('Intake updated successfully')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateIntakeDto: UpdateIntakeDto,
  ) {
    return this.intakeService.update(user.id, updateIntakeDto);
  }
}
