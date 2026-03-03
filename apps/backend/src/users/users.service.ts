import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from '@dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    if (!email || !name || !password) {
      throw new Error('Missing required fields');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    return 'User created successfully';
  }
}
