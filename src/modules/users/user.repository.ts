import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterDto } from '../auth/dto/register.dto';
import { GoogleProfile } from 'src/types/auth.types';

interface GoogleProfileData extends GoogleProfile {
  password: null;
  isEmailVerified: true;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(data: RegisterDto) {
    return this.userModel.create(data);
  }

  async googleCreate(data: GoogleProfileData) {
    return this.userModel.create(data);
  }

  async findById(id: string) {
    return this.userModel.findByPk(id, {
      attributes: { exclude: ['password', 'googleId', 'hashedRefreshToken'] },
    });
  }

  async findCompleteUserById(id: string) {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findAll() {
    return this.userModel.findAll();
  }

  async update(id: string, data: Partial<User>) {
    await this.userModel.update(data, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id: string) {
    return await this.userModel.destroy({
      where: { id },
    });
  }
}
