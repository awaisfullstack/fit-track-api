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
import { SEX } from '../enums/sex.enum';
import { UnitPreference } from '../enums/unit-preference.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { DietaryPreference } from '../enums/dietary-preference.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Table({
  tableName: 'intakes',
  timestamps: true,
  underscored: true,
})
export class Intake extends Model<
  InferAttributes<Intake>,
  InferCreationAttributes<Intake>
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
  declare age: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare height: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare weight: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare occupation: string | null;

  @Column({
    type: DataType.DECIMAL(4, 2),
    allowNull: false,
  })
  declare sleepHours: number;

  @Column({
    type: DataType.ENUM(...Object.values(SEX)),
    allowNull: false,
  })
  declare sex: SEX;

  @Column({
    type: DataType.ENUM(...Object.values(ActivityLevel)),
    allowNull: false,
  })
  declare activityLevel: ActivityLevel;

  @Column({
    type: DataType.ENUM(...Object.values(UnitPreference)),
    allowNull: false,
    defaultValue: UnitPreference.METRIC,
  })
  declare unitPreference: UnitPreference;

  @Column({
    type: DataType.ENUM(...Object.values(DietaryPreference)),
    allowNull: false,
  })
  declare dietaryPreference: DietaryPreference;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasHypertension: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasDiabetes: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasJointIssues: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isPregnant: boolean;

  @Column({
    type: DataType.DECIMAL(4, 1),
    allowNull: false,
  })
  declare bmi: number;

  @Column({
    type: DataType.DECIMAL(6, 1),
    allowNull: false,
  })
  declare bmr: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User, 'userId')
  declare user: NonAttribute<User>;
}
