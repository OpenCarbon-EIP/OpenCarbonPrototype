import type { company, consultant, user } from 'src/generated/prisma/client';

export type SafeUser = Omit<user, 'password' | 'createdAt' | 'updatedAt'> & {
  consultant?: consultant | null;
  company?: company | null;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
