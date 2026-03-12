import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { user } from 'src/generated/prisma/client';
import type { SafeUser } from 'src/types/user.types';

export const SAFE_USER_OMIT = {
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<SafeUser | null> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.prisma.user.findUnique({
      where: { id },
      omit: SAFE_USER_OMIT,
      include: {
        consultant: true,
        company: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
