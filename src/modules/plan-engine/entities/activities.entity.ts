import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ActivityType } from '../enums/activity-type.enum';
import { Intensity } from '../enums/intensity.enum';

@Table({
  tableName: 'activities',
  timestamps: true,
  underscored: true,
})
export class Activity extends Model<
  InferAttributes<Activity>,
  InferCreationAttributes<Activity>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare activityName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare defaultDurationMinutes: number;

  @Column({
    type: DataType.ENUM(...Object.values(ActivityType)),
    allowNull: false,
  })
  declare activityType: ActivityType;

  @Column({
    type: DataType.ENUM(...Object.values(Intensity)),
    allowNull: false,
  })
  declare intensity: Intensity;
}
