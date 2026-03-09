import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  id_offer: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

