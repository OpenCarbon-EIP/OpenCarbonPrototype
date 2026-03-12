import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { SetupConsultantDto, SetupCompanyDto } from '@dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('setup-consultant')
  @Roles(['CONSULTANT'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create consultant profile for the authenticated user',
  })
  @SwaggerResponse({ status: 201, description: 'Consultant profile created' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 409,
    description: 'Consultant profile already exists',
  })
  async setupConsultant(
    @Session() session: UserSession,
    @Body() body: SetupConsultantDto,
  ) {
    const profile = await this.authService.createConsultantProfile(
      session.user.id,
      body,
    );

    return {
      success: true,
      data: profile,
      message: 'Consultant profile created successfully',
    };
  }

  @Post('setup-company')
  @Roles(['COMPANY'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create company profile for the authenticated user',
  })
  @SwaggerResponse({ status: 201, description: 'Company profile created' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 409,
    description: 'Company profile already exists',
  })
  async setupCompany(
    @Session() session: UserSession,
    @Body() body: SetupCompanyDto,
  ) {
    const profile = await this.authService.createCompanyProfile(
      session.user.id,
      body,
    );

    return {
      success: true,
      data: profile,
      message: 'Company profile created successfully',
    };
  }
}
