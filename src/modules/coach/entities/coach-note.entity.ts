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
  tableName: 'coach_notes',
  timestamps: true,
  underscored: true,
})
export class CoachNote extends Model<
  InferAttributes<CoachNote>,
  InferCreationAttributes<CoachNote>
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
  declare noteText: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare coachId: string;

  @BelongsTo(() => User, 'coachId')
  declare coach: NonAttribute<User>;
}
