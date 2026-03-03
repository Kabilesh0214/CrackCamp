import { Controller, Post, Patch, Body, Request, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { selectRoleDto } from './dto/select-role.dto';
import { JwtAuthGuard } from './jwt.authguard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('verify')
  async verify(@Body() body: VerifyDto) {
    return this.authService.verify(body)
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('select-role')
  async selectRole(
    @Body() body: selectRoleDto, 
    @Request() req) {
      return this.authService.selectRole(req.user.userId, body.role);
  }

}



