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
  tableName: 'email_verifications',
  timestamps: true,
  underscored: true,
})
export class EmailVerification extends Model<
  InferAttributes<EmailVerification>,
  InferCreationAttributes<EmailVerification>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare otpHash: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare attempts: CreationOptional<number>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiresAt: Date;

  @Column({
    type: DataType.DATE,
  })
  declare verifiedAt: Date | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
