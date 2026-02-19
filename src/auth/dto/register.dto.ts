import { IsEmail, IsString, Length, IsEnum } from "class-validator";
import { Role } from '@prisma/client';

export class RegisterDto {

  @IsString()
  @Length(3, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsEnum(Role)
  role: Role;

}