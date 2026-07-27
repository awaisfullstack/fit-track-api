import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { CompletionStatus } from '../enums/completion-status.enum';
import { PlanActivity } from 'src/modules/plan-engine/entities/plan-activities.entity';

@Table({
  tableName: 'activity_logs',
  timestamps: true,
  underscored: true,
})
export class ActivityLog extends Model<
  InferAttributes<ActivityLog>,
  InferCreationAttributes<ActivityLog>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare logDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CompletionStatus)),
    allowNull: true,
  })
  declare completionStatus: CompletionStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;

  @ForeignKey(() => PlanActivity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare planActivityId: string;

  @BelongsTo(() => PlanActivity, 'planActivityId')
  declare planActivity: NonAttribute<PlanActivity>;
}
