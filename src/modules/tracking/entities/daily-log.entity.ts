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
  tableName: 'daily_logs',
  timestamps: true,
  underscored: true,
})
export class DailyLog extends Model<
  InferAttributes<DailyLog>,
  InferCreationAttributes<DailyLog>
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
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  declare weight: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare moodRating: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
