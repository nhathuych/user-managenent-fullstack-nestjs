import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/decorators/skip-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login') // /api/v1/auth/login
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
