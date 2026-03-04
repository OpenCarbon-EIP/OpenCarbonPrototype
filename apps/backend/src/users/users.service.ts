import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from '@dtos/user.dto';
import type { user } from 'src/generated/prisma/client';
import type { SafeUser } from 'src/types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    }));
  }

  async getUserById(id: string): Promise<SafeUser | null> {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<user> {
    const { email, name, password } = createUserDto;

    if (!email || !name || !password) {
      throw new Error('Missing required fields');
    }

    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }
}
