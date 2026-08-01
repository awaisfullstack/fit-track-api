import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import type { CookieOptions, Response } from 'express';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import type {
  AuthenticatedUser,
  GoogleProfile,
  JwtPayloadWithRefreshToken,
  Tokens,
} from 'src/types/auth.types';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';

interface CurrentRequest extends Request {
  user: JwtPayloadWithRefreshToken;
}

interface CurrentGoogleUserRequest extends Request {
  user: GoogleProfile;
}

const isProd = process.env.NODE_ENV === 'production';

// Centralized cookie config so access/refresh/clear all stay consistent.
// sameSite: 'none' + secure: true is what you need for the Vercel <-> Render
// cross-origin setup — same as what you landed on for the login cookie.
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage(
    'Signup successful. Check your email for the verification code',
  )
  async create(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.verifyOtp(
      dto.email,
      dto.otp,
    );
    this.setAuthCookies(res, tokens);
    return { user };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('A new verification code has been sent.')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: CurrentGoogleUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const profile = req.user;
      const { tokens } = await this.authService.validateGoogleUser(profile);
      this.setAuthCookies(res, tokens);
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-callback`);
    } catch {
      return res.redirect(
        `${process.env.FRONTEND_URL}/oauth-callback?error=google_auth_failed`,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ResponseMessage('User login successfully')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);
    this.setAuthCookies(res, tokens);
    return { user };
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ResponseMessage('Tokens refreshed')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: CurrentRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    // req.user is set by JwtRefreshStrategy.validate() -> { sub, email, refreshToken }
    const { sub: userId, refreshToken } = req.user;
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setAuthCookies(res, tokens);
    return null;
  }

  @UseGuards(JwtAccessGuard)
  @ResponseMessage('Logged out')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);
    return null;
  }

  private setAuthCookies(res: Response, tokens: Tokens) {
    res.cookie('accessToken', tokens.accessToken, {
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes, keep in sync with JWT_ACCESS_EXPIRES_IN
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, keep in sync with JWT_REFRESH_EXPIRES_IN
    });
  }
}
