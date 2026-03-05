import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { SafeUser } from 'src/types/user.types';

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
  role: SafeUser['role'];

  @IsString()
  @IsOptional()
  description?: string;

  // Consultant

  @ValidateIf((o: SafeUser) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ValidateIf((o: SafeUser) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ValidateIf((o: SafeUser) => o.role === 'CONSULTANT')
  @IsString()
  @IsNotEmpty()
  professional_title?: string;

  // --- Company

  @ValidateIf((o: SafeUser) => o.role === 'COMPANY')
  @IsString()
  @IsNotEmpty()
  company_name?: string;

  @ValidateIf((o: SafeUser) => o.role === 'COMPANY')
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
