import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { Role } from 'src/generated/prisma/client';
import { RegistrationRole } from './user.dto';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(RegistrationRole, {
    message: `role must be one of: ${Object.values(RegistrationRole).join(', ')}`,
  })
  role: Role;

  @IsString()
  @IsOptional()
  description?: string;

  // Consultant

  @ValidateIf((o: RegisterDto) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ValidateIf((o: RegisterDto) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ValidateIf((o: RegisterDto) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  professional_title?: string;

  // Company

  @ValidateIf((o: RegisterDto) => o.role === 'COMPANY')
  @IsString()
  @IsNotEmpty()
  company_name?: string;

  @ValidateIf((o: RegisterDto) => o.role === 'COMPANY')
  @IsInt()
  @IsOptional()
  company_size?: number;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
