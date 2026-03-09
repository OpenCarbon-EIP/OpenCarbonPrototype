import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from '@dtos/application.dto';
import type { application } from 'src/generated/prisma/client';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<application> {
    const { id_consultant, id_offer, content } = createApplicationDto;

    if (!id_consultant || !id_offer || !content) {
      throw new BadRequestException('All fields are required');
    }

    return await this.prisma.application.create({
      data: {
        id_consultant,
        id_offer,
        content,
      },
    });
  }

  async deleteApplication(id: string): Promise<application | null> {
    if (!id) {
      throw new BadRequestException('Application ID is required');
    }

    return await this.prisma.application.delete({
      where: { id },
    });
  }
}