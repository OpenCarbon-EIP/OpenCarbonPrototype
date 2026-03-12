import 'dotenv/config';
import { APIError, betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createAuthMiddleware } from 'better-auth/api';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ALLOWED_SIGNUP_ROLES = ['CONSULTANT', 'COMPANY'];

export const auth = betterAuth({
  basePath: '/api/auth',
  trustedOrigins: ['http://localhost:3000'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'CONSULTANT',
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CONSULTANT',
        input: true,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const body = await ctx.body();
        const { role } = body as { role: string };

        if (!ALLOWED_SIGNUP_ROLES.includes(role)) {
          throw new APIError('BAD_REQUEST', {
            message: `Invalid role. Allowed roles: ${ALLOWED_SIGNUP_ROLES.join(', ')}`,
          });
        }
      }
    }),
  },
});
