import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { JwtService } from '@nestjs/jwt';
import { VerifyDto } from './dto/verify.dto';
import { MailService } from 'src/auth/mail.service';
import { selectRoleDto } from './dto/select-role.dto';


@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis, //connect Redis
  ) { }

  async register(data: RegisterDto) {

    const existingUser = await this.findUser(data.email);

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const otp = this.generateOTP().toString();
    const hashedPassword = await this.hashPassword(data.password);
    const otpHash = await bcrypt.hash(otp, 10);

    const tempData = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      // role: data.role,
      otpHash,
    };

    // stores temporary data to redis 
    await this.redis.set(
      `register:${data.email}`,
      JSON.stringify(tempData),
      "EX",
      300
    );

    // send otp via email 
    await this.mailService.sendOTP(data.email, otp);

    return { message: "OTP sent" };

  }

  async verify(data: VerifyDto) {

    const { email, otp } = data;

    const storedData = await this.redis.get(`register:${email}`);

    if (!storedData) {
      throw new BadRequestException("OTP expired or not found");
    }

    // Check redis otp with otp from user
    const parsedData = JSON.parse(storedData);

    const isValid = await bcrypt.compare(
      otp.toString(),
      parsedData.otpHash
    );

    if (!isValid) {
      throw new BadRequestException("Invalid OTP");
    }

    // Store actual data to Postgres
    const newUser = await this.prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: parsedData.password,
      },
    });

    // Delete the temporary data
    await this.redis.del(`register:${email}`);

    // Gives the token to Frontend
    const token = await this.generateToken(newUser);

    return {
      success: true,
      message: "User registered successfully",
      token: token,
    };
  }


  async login(data: LoginDto) {

    // Checks if user exist
    const user = await this.findUser(data.email);

    if (!user) {
      throw new BadRequestException("Invalid credentials")
    }

    // Checks user's Password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials")
    }

    // Generates JSON Web Token 

    const token = await this.generateToken(user)
    return {
      success: true,
      message: "Login successful",
      token: token
    }

  }


  async selectRole(userId, role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }



  private async findUser(email): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    });
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );
    return hashedPassword;
  }

  private async generateToken(user): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  private generateOTP(): number {
    return crypto.randomInt(100000, 999999);
  }
}




