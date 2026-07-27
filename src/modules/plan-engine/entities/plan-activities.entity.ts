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
import { Plan } from './plan.entity';
import { Activity } from './activities.entity';

@Table({
  tableName: 'plan_activities',
  timestamps: true,
  underscored: true,
})
export class PlanActivity extends Model<
  InferAttributes<PlanActivity>,
  InferCreationAttributes<PlanActivity>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 7,
    },
  })
  declare dayOfWeek: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare durationMinutes: number;

  @ForeignKey(() => Plan)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare planId: string;

  @BelongsTo(() => Plan, 'planId')
  declare plan: NonAttribute<Plan>;

  @ForeignKey(() => Activity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare activityId: string;

  @BelongsTo(() => Activity, 'activityId')
  declare activity: NonAttribute<Activity>;
}
