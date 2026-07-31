import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // We're not using express-session anywhere in this app (JWTs in cookies
  // instead), so tell passport not to try to establish one.
  getAuthenticateOptions() {
    return {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth`,
    };
  }
}
