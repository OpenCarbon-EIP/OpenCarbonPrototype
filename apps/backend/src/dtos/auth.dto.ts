import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetupConsultantDto {
  @ApiProperty({ example: 'Doe', description: 'Consultant last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'John', description: 'Consultant first name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Carbon Auditor',
    description: 'Professional title',
  })
  @IsString()
  @IsNotEmpty()
  professional_title: string;

  @ApiPropertyOptional({
    example: 'Experienced carbon auditor with 5 years of expertise',
    description: 'Consultant description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class SetupCompanyDto {
  @ApiProperty({ example: 'GreenCorp', description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Number of employees',
  })
  @IsInt()
  @IsOptional()
  company_size?: number;

  @ApiPropertyOptional({
    example: 'Leading company in sustainable energy solutions',
    description: 'Company description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
