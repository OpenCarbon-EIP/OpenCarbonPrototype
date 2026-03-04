import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user';
import { ApiResponse } from 'src/types/global';
import { SafeUser } from 'src/types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @CurrentUser() user: Express.User,
  ): Promise<ApiResponse<SafeUser>> {
    const me = await this.usersService.getUserById(user.id);

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
  @UseGuards(JwtAuthGuard)
  async getUserById(
    @Param('id') id: string,
    @CurrentUser() user: Express.User,
  ): Promise<ApiResponse<SafeUser>> {
    if (user.id !== id) {
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
