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
import { PlanStatus } from '../enums/status.enum';
import { Goal } from 'src/modules/goals/entities/goal.entity';

@Table({
  tableName: 'plans',
  timestamps: true,
  underscored: true,
})
export class Plan extends Model<
  InferAttributes<Plan>,
  InferCreationAttributes<Plan>
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
      min: 0,
    },
  })
  declare weekNumber: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare calorieTarget: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare endDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PlanStatus)),
    allowNull: false,
    defaultValue: PlanStatus.ACTIVE,
  })
  declare status: PlanStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stepTarget: number;

  @ForeignKey(() => Goal)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare goalId: string;

  @BelongsTo(() => Goal, 'goalId')
  declare goal: NonAttribute<Goal>;
}
