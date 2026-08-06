import { IsIn } from 'class-validator';
import { GoalStatus } from '../enums/status.enum';

// A goal can only ever be closed out this way — you can't PATCH
// something back to ACTIVE, and you can't set it ACTIVE here either.
// New active goals only come from POST /goals.
export class UpdateGoalStatusDto {
  @IsIn([GoalStatus.ACHIEVED, GoalStatus.ABANDONED], {
    message: 'Status must be either achieved or abandoned',
  })
  status!: GoalStatus.ACHIEVED | GoalStatus.ABANDONED;
}
