import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

    await this.redis.set(
      `register:${data.email}`,
      JSON.stringify(tempData),
      "EX",
      300
    );

    await this.mailService.sendOTP(data.email, otp);

    return {
      success: true,
      message: "OTP sent"
    };

  }

  async verify(data: VerifyDto) {

    const { email, otp } = data;

    const storedData = await this.redis.get(`register:${email}`);

    if (!storedData) {
      throw new BadRequestException("OTP expired or not found");
    }

    const parsedData = JSON.parse(storedData);

    const isValid = await bcrypt.compare(
      otp.toString(),
      parsedData.otpHash
    );

    if (!isValid) {
      throw new BadRequestException("Invalid OTP");
    }

    const newUser = await this.prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: parsedData.password,
      },
    });

    await this.redis.del(`register:${email}`);

    const { accessToken, refreshToken } = await this.generateTokenPair(newUser);

    return {
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    };
  }


  async login(data: LoginDto) {

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

    // Generates token pair (access + refresh)
    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    return {
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    }

  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    // Find the refresh token in DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Check expiry
    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException("Refresh token expired");
    }

    // Get the user
    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Rotate: delete old token and issue new pair
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newTokens = await this.generateTokenPair(user);

    return {
      success: true,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      // Delete the specific refresh token
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  }

  async selectRole(req, role) {

    await this.prisma.user.update({
      where: { id: req.user.userId },
      data: { role },
    });

    return {
      success: true
    }
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

  private async generateTokenPair(user): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Short-lived access token (15 minutes)
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Long-lived refresh token (7 days) — stored in DB
    const refreshTokenValue = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Clean up old refresh tokens for this user (max 5 active sessions)
    const existingTokens = await this.prisma.refreshToken.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    });

    if (existingTokens.length >= 5) {
      const toDelete = existingTokens.slice(0, existingTokens.length - 4);
      await this.prisma.refreshToken.deleteMany({
        where: { id: { in: toDelete.map(t => t.id) } },
      });
    }

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenValue,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  private generateOTP(): number {
    return crypto.randomInt(100000, 999999);
  }
}
