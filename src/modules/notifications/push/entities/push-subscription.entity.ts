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
  tableName: 'push_subscriptions',
  timestamps: true,
  underscored: true,
})
export class PushSubscription extends Model<
  InferAttributes<PushSubscription>,
  InferCreationAttributes<PushSubscription>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare endpoint: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  declare keys: JSON;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare quietHoursEnabled: CreationOptional<boolean>;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare quietStartTime: string | null;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare quietEndTime: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
