import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  location?: string;

  @IsNumber()
  budget?: number;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  deadline?: Date;

  status?: OfferStatus;
}
