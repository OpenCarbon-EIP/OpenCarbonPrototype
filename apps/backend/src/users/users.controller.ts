import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ApiResponse } from 'src/types/global';
import { SafeUser } from 'src/types/user.types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @SwaggerResponse({ status: 200, description: 'User profile retrieved' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Session() session: UserSession): Promise<ApiResponse<SafeUser>> {
    const me = await this.usersService.getUserById(session.user.id);

    if (!me) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: me,
      message: 'User profile retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (own profile only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @SwaggerResponse({ status: 200, description: 'User retrieved' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 403,
    description: 'Cannot access another user profile',
  })
  @SwaggerResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id') id: string,
    @Session() session: UserSession,
  ): Promise<ApiResponse<SafeUser>> {
    if (session.user.id !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }

    const found = await this.usersService.getUserById(id);
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      data: found,
      message: 'User retrieved successfully',
    };
  }
}
