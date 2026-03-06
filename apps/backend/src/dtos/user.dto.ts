import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/generated/prisma/client';

export enum RegistrationRole {
  CONSULTANT = 'CONSULTANT',
  COMPANY = 'COMPANY',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(RegistrationRole, {
    message: `role must be one of: ${Object.values(RegistrationRole).join(', ')}`,
  })
  role?: Role;
}
