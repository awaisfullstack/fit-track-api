import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailVerification } from './entities/email-verification.entity';
import { EmailVerificationRepository } from './repositories/email-verification.repository';
import { MailModule } from '../mail/mail.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([EmailVerification]),
    PassportModule,
    UsersModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    EmailVerificationRepository,
  ],
})
export class AuthModule {}
