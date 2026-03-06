import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OfferStatus } from 'src/generated/prisma/client';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  @IsNotEmpty()
  deadline: Date;
}

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value as string))
  deadline?: Date;

  @IsOptional()
  status?: OfferStatus;
}
