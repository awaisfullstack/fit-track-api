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
import { User } from 'src/modules/users/entities/user.entity';

@Table({
  tableName: 'plan_overrides',
  timestamps: true,
  underscored: true,
})
export class PlanOverrride extends Model<
  InferAttributes<PlanOverrride>,
  InferCreationAttributes<PlanOverrride>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare changedField: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare oldValue: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare newValue: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare reason: string;

  @ForeignKey(() => Plan)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare planId: string;

  @BelongsTo(() => Plan, 'planId')
  declare plan: NonAttribute<Plan>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare coachId: string;

  @BelongsTo(() => User, 'coachId')
  declare coach: NonAttribute<User>;
}
