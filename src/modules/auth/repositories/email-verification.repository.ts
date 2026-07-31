import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { EmailVerification } from '../entities/email-verification.entity';

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectModel(EmailVerification)
    private readonly emailVerificationModel: typeof EmailVerification,
  ) {}

  async create(data: CreationAttributes<EmailVerification>) {
    return this.emailVerificationModel.create(data);
  }

  async findByUser(userId: string) {
    return await this.emailVerificationModel.findOne({
      where: { userId },
    });
  }

  async update(id: string, data: Partial<EmailVerification>) {
    await this.emailVerificationModel.update(data, {
      where: { userId: id },
    });
  }
}
