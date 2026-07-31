import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  JwtPayload,
  JwtPayloadWithRefreshToken,
  Tokens,
} from 'src/types/auth.types';
import { ConfigService } from '@nestjs/config';

const cookieExtractor = (request: Request): string | null => {
  const cookies = request?.cookies as Tokens;
  return cookies?.refreshToken ?? null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  // req is available here because passReqToCallback is true above.
  // We attach the raw refresh token (from the cookie) alongside the
  // decoded payload so the service can compare it against the hash in the DB.
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const cookies = req.cookies as Tokens;
    const refreshToken = req.headers.authorization?.split(' ')[1];

    return { ...payload, refreshToken: cookies?.refreshToken ?? refreshToken };
  }
}
