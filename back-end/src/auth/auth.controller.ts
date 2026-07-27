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
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { success: result.success, message: result.message };
  }

  @Public()
  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(data);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { success: result.success, message: result.message };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.authService.refreshTokens(refreshToken);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { success: result.success };
  }

  @Public()
  @Post('logout')
  async logout(
    @Request() req,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.authService.logout(refreshToken);

    res.clearCookie('access_token', { httpOnly: true, secure: false, sameSite: 'lax' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: false, sameSite: 'lax' });

    return result;
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('select-role')
  async selectRole(
    @Body() body: selectRoleDto,
    @Request() req) {
    return this.authService.selectRole(req, body.role);
  }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

}
