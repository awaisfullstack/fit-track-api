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
import { GoalStatus } from '../enums/status.enum';

@Table({
  tableName: 'goals',
  timestamps: true,
  underscored: true,
})
export class Goal extends Model<
  InferAttributes<Goal>,
  InferCreationAttributes<Goal>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare targetWeight: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare targetDate: Date;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
  })
  declare weeklyLossRate: number;

  @Column({
    type: DataType.ENUM(...Object.values(GoalStatus)),
    allowNull: false,
    defaultValue: GoalStatus.ACTIVE,
  })
  declare status: GoalStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
