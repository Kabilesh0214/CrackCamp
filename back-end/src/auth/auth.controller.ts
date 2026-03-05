import { Controller, Post, Patch, Body, Request, Res, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { selectRoleDto } from './dto/select-role.dto';
import { JwtAuthGuard } from './jwt.authguard';
import { Public } from './public.decorator';

@Controller('auth')


export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('verify')
  async verify(
    @Body() body: VerifyDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.verify(body);
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return result;
  }

  @Public()
  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(data);
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return result;
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('select-role')
  async selectRole(
    @Body() body: selectRoleDto,
    @Request() req) {
    return this.authService.selectRole(req, body.role);
  }

}



