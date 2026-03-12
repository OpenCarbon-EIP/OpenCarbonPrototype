import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { ApiResponse } from 'src/types/global';
import type { application } from 'src/generated/prisma/client';
import { CreateApplicationDto } from '@dtos/application.dto';
import { Roles, Session, type UserSession } from '@thallesp/nestjs-better-auth';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Get all applications for the authenticated consultant',
  })
  @SwaggerResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async getAllApplicationsByUserId(
    @Session() session: UserSession,
  ): Promise<ApiResponse<application[]>> {
    const applications =
      await this.applicationService.getAllApplicationsByUserId(session.user.id);
    return {
      success: true,
      data: applications,
      message: 'Applications retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific application by ID' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @SwaggerResponse({
    status: 200,
    description: 'Application retrieved successfully',
  })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 403,
    description: 'Not allowed to access this application',
  })
  @SwaggerResponse({ status: 404, description: 'Application not found' })
  async getApplicationById(
    @Param('id') id: string,
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
  @Roles(['CONSULTANT'])
  @ApiOperation({ summary: 'Create a new application (consultant only)' })
  @SwaggerResponse({
    status: 201,
    description: 'Application created successfully',
  })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Session() session: UserSession,
  ): Promise<ApiResponse<application>> {
    const application = await this.applicationService.createApplication(
      createApplicationDto,
      session.user.id,
    );
    return {
      success: true,
      data: application,
      message: 'Application created successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application by ID' })
  @ApiParam({ name: 'id', description: 'Application UUID to delete' })
  @SwaggerResponse({
    status: 200,
    description: 'Application deleted successfully',
  })
  @SwaggerResponse({ status: 400, description: 'Application ID is required' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 403,
    description: 'Not allowed to delete this application',
  })
  @SwaggerResponse({ status: 404, description: 'Application not found' })
  async deleteApplication(
    @Param('id') id: string,
    @Session() session: UserSession,
  ): Promise<ApiResponse<application[]>> {
    const applications = await this.applicationService.deleteApplication(
      id,
      session.user.id,
    );

    if (!applications) {
      throw new NotFoundException('Application not found');
    }

    return {
      success: true,
      data: applications,
      message: 'Applications deleted successfully',
    };
  }
}
