import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '@prisma/prisma.service';
import type { SafeUser } from 'src/types/user.types';
import type { SetupConsultantDto, SetupCompanyDto } from '@dtos/auth.dto';
import type { consultant, company } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(userId: string): Promise<SafeUser | null> {
    return await this.usersService.getUserById(userId);
  }

  async createConsultantProfile(
    userId: string,
    data: SetupConsultantDto,
  ): Promise<consultant> {
    const existing = await this.prisma.consultant.findUnique({
      where: { id_user: userId },
    });

    if (existing) {
      throw new ConflictException(
        'Consultant profile already exists for this user',
      );
    }

    return this.prisma.consultant.create({
      data: {
        last_name: data.last_name,
        first_name: data.first_name,
        professional_title: data.professional_title,
        description: data.description,
        id_user: userId,
      },
    });
  }

  async createCompanyProfile(
    userId: string,
    data: SetupCompanyDto,
  ): Promise<company> {
    const existing = await this.prisma.company.findUnique({
      where: { id_user: userId },
    });

    if (existing) {
      throw new ConflictException(
        'Company profile already exists for this user',
      );
    }

    return this.prisma.company.create({
      data: {
        company_name: data.company_name,
        company_size: data.company_size,
        description: data.description,
        id_user: userId,
      },
    });
  }
}
