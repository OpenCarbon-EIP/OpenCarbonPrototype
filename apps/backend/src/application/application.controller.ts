import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Delete,
  ForbiddenException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiResponse } from 'src/types/global';
import type { application } from 'src/generated/prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateApplicationDto } from '@dtos/application.dto';
import { CurrentUser } from 'src/decorators/current-user';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllApplicationsByUserId(
    @CurrentUser() user: Express.User,
  ): Promise<ApiResponse<application[]>> {
    const applications = await this.applicationService.getAllApplicationsByUserId(user.id);

    if (!applications) {
      throw new NotFoundException('No applications found');
    }

    return {
      success: true,
      data: applications,
      message: 'Applications retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getApplicationById(
    @Param('id') id: string
  ): Promise<ApiResponse<application>> {
    const application = await this.applicationService.getApplicationById(id);
    
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      data: application,
      message: 'Application retrieved successfully',
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto
  ): Promise<ApiResponse<application>> {
    const application = await this.applicationService.createApplication(createApplicationDto);

    return {
      success: true,
      data: application,
      message: 'Application created successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteApplication(
    @Param('id') id: string
  ): Promise<ApiResponse<application | null>> {
    const application = await this.applicationService.deleteApplication(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      data: application,
      message: 'Application deleted successfully',
    };
  }
}