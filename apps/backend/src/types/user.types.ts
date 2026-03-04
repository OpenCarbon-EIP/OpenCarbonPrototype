import type { user } from 'src/generated/prisma/client';

export type SafeUser = Omit<user, 'password' | 'createdAt' | 'updatedAt'>;

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
};

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
