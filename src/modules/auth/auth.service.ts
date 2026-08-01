import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '../users/user.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import {
  AuthenticatedUser,
  GoogleProfile,
  JwtPayload,
  Tokens,
} from 'src/types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { EmailVerificationRepository } from './repositories/email-verification.repository';

const OTP_EXPIRES_IN_MINUTES = Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: RegisterDto) {
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    await this.generateAndSendOtp(user);

    return {
      email: user.email,
    };
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ user: Partial<User>; tokens: Tokens }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid request');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const emailVerification = await this.emailVerificationRepository.findByUser(
      user.id,
    );
    if (!emailVerification) {
      throw new BadRequestException('Invalid request');
    }
    if (!emailVerification.otpHash || !emailVerification.expiresAt) {
      throw new BadRequestException(
        'No verification code pending. Request a new one.',
      );
    }
    await this.emailVerificationRepository.update(user.id, {
      attempts: emailVerification.attempts + 1,
    });
    if (new Date() > new Date(emailVerification.expiresAt)) {
      throw new BadRequestException(
        'Verification code expired. Request a new one.',
      );
    }

    const otpMatches = await bcrypt.compare(otp, emailVerification.otpHash);
    if (!otpMatches) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.userRepository.update(user.id, {
      isEmailVerified: true,
    });

    await this.emailVerificationRepository.update(user.id, {
      verifiedAt: new Date(),
    });

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    const freshUser = await this.userRepository.findById(user.id);

    return {
      user: freshUser!,
      tokens,
    };
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid request');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.generateAndResendOtp(user);
    return null;
  }

  async validateGoogleUser(
    profile: GoogleProfile,
  ): Promise<{ tokens: Tokens }> {
    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      user = await this.userRepository.googleCreate({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        password: null,
        googleId: profile.googleId,
        avatar: profile.avatar,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      await this.userRepository.update(user.id, {
        googleId: profile.googleId,
        isEmailVerified: true,
      });
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return {
      tokens,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await bcrypt.compare(
      data.password,
      user.password as string,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      // Give them a fresh code rather than making them dig up the old email.
      await this.generateAndSendOtp(user);
      throw new ForbiddenException(
        'Email not verified. A new verification code has been sent.',
      );
    }

    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    const freshUser = await this.userRepository.findById(user.id);

    return {
      user: freshUser,
      tokens,
    };
  }

  async getProfile(id: string) {
    return this.userRepository.findById(id);
  }

  async logout(userId: string): Promise<void> {
    // Clear the stored refresh token hash so the old refresh token
    // (and any leaked copy of it) can never be used again.
    await this.userRepository.update(userId, { hashedRefreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findCompleteUserById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // ---------- HELPERS ----------

  private async generateAndSendOtp(user: User): Promise<void> {
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

    await this.emailVerificationRepository.create({
      userId: user.id,
      otpHash,
      expiresAt,
    });

    await this.mailService.sendOtpEmail(user.email, otp);
  }

  private async generateAndResendOtp(user: User): Promise<void> {
    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

    await this.emailVerificationRepository.update(user.id, {
      otpHash,
      expiresAt,
      attempts: 0,
    });

    await this.mailService.sendOtpEmail(user.email, otp);
  }

  private generateOtp(): string {
    // 6-digit numeric code, zero-padded
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async getTokens(user: AuthenticatedUser): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET as StringValue,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET as StringValue,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { hashedRefreshToken });
  }
}
