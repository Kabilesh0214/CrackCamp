import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService) {}
  
  async register(data: RegisterDto) {

    const existingUser =  await this.prisma.user.findUnique({
      where: {email: data.email}
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    } else {
      await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role
        }
      });
    }
  }
}




