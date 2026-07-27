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

@Table({
  tableName: 'weekly_summaries',
  timestamps: true,
  underscored: true,
})
export class WeeklySummary extends Model<
  InferAttributes<WeeklySummary>,
  InferCreationAttributes<WeeklySummary>
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
  declare weekStartDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare weekEndDate: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  declare averageWeight: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare streak: CreationOptional<number>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare summaryText: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
