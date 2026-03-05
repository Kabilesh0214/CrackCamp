import { IsEmail, IsNumber } from "class-validator";


export class VerifyDto {

  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}