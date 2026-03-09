import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  id_consultant: string;

  @IsString()
  @IsNotEmpty()
  id_offer: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

