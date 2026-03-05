import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from '@dtos/user.dto';
import type { user } from 'src/generated/prisma/client';
import type { SafeUser } from 'src/types/user.types';

const SAFE_USER_OMIT = {
  password: true,
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
    });
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { email, name, password, role } = createUserDto;

    if (!email || !name || !password) {
      throw new BadRequestException('Email, name, and password are required');
    }

    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        ...(role && { role }),
      },
    });
  }
}
