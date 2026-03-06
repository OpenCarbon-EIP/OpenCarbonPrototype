import { RegisterDto, LoginDto } from '@dtos/auth.dto';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload, SafeUser } from 'src/types/user.types';
import { AuthResponse } from 'src/types/auth.types';
import { ConsultantService } from 'src/consultant/consultant.service';
import { CompanyService } from 'src/company/company.service';
import { Role } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly consultantService: ConsultantService,
    private readonly companyService: CompanyService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, role } = registerDto;

    const emailTrim = email.trim().toLowerCase();

    const existingUsers = await this.usersService.getUserByEmail(emailTrim);

    if (existingUsers) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword: string = await hash(password, saltRounds);

    let user;
    try {
      user = await this.usersService.createUser({
        email: emailTrim,
        password: hashedPassword,
        name,
        role,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }

    if (role === Role.CONSULTANT) {
      const { last_name, first_name, professional_title, description } =
        registerDto;

      if (!last_name || !first_name || !professional_title) {
        throw new BadRequestException(
          'last_name, first_name and professional_title are required for consultants',
        );
      }

      await this.consultantService.createConsultant({
        last_name,
        first_name,
        professional_title,
        description,
        id_user: user.id,
      });
    } else if (role === Role.COMPANY) {
      const { company_name, company_size, description } = registerDto;

      if (!company_name) {
        throw new BadRequestException('company_name is required for companies');
      }

      await this.companyService.createCompany({
        company_name,
        company_size,
        description,
        id_user: user.id,
      });
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const emailTrim = email.trim().toLowerCase();

    const user = await this.usersService.getUserByEmail(emailTrim);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string): Promise<SafeUser | null> {
    return await this.usersService.getUserById(userId);
  }
}
