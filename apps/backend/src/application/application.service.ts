import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from '@dtos/application.dto';
import type { application } from 'src/generated/prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async getAllApplicationsByUserId(userId: string): Promise<application[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.prisma.application.findMany({
      where: { id_consultant: userId },
    });
  }

  async getApplicationById(id: string): Promise<application | null> {
    if (!id) {
      throw new BadRequestException('Application ID is required');
    }

    return await this.prisma.application.findUnique({
      where: { id },
    });
  }

  async createApplication(
    createApplicationDto: CreateApplicationDto,
    userId: string,
  ): Promise<application> {
    const { id_offer, content } = createApplicationDto;

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role !== 'CONSULTANT') {
      throw new BadRequestException('Only consultants can create applications');
    }

    if (!userId || !id_offer || !content) {
      throw new BadRequestException('All fields are required');
    }

    try {
      return await this.prisma.application.create({
        data: {
          id_consultant: userId,
          id_offer,
          content,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create application');
    }
  }

  async deleteApplication(id: string): Promise<application | null> {
    if (!id) {
      throw new BadRequestException('Application ID is required');
    }

    try {
      return await this.prisma.application.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete application');
    }
  }
}
