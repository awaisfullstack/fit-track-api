import { Role } from 'src/modules/users/enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
