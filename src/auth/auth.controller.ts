import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/decorators/skip-auth';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorators/response';
import { VerifyAccountAuthDto } from './dto/verify-account-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successful')
  @Post('login') // /api/v1/auth/login
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Post('register') // /api/v1/auth/register
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @SkipAuth()
  @Post('verify-account')
  verifyAccount(@Body() verifyAccountAuthDto: VerifyAccountAuthDto) {
    return this.authService.verifyAccount(verifyAccountAuthDto);
  }

  @SkipAuth()
  @Post('resend-mail')
  resendVerifyEmail(@Body('email') email: string) {
    return this.authService.resendVerifyEmail(email);
  }

  @SkipAuth()
  @Post('send-reset-password-email')
  sendResetPasswordEmail(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @SkipAuth()
  @Post('update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @SkipAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
