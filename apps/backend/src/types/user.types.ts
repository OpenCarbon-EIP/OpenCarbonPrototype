import type { company, consultant, user } from 'src/generated/prisma/client';

export type SafeUser = Omit<user, 'createdAt' | 'updatedAt'> & {
  consultant?: consultant | null;
  company?: company | null;
};
