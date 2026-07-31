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
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/status.enum';
import { Provider } from '../enums/provider.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      len: [8, 255],
    },
  })
  declare password: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.MEMBER,
  })
  declare role: CreationOptional<Role>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isEmailVerified: CreationOptional<boolean>;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare googleId: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare avatar: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare hashedRefreshToken: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Provider)),
    allowNull: false,
    defaultValue: Provider.LOCAL,
  })
  declare provider: CreationOptional<Provider>;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    allowNull: false,
    defaultValue: UserStatus.ACTIVE,
  })
  declare status: CreationOptional<UserStatus>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare coachId: string | null;

  @BelongsTo(() => User, 'coachId')
  declare coach: NonAttribute<User | null>;
}
