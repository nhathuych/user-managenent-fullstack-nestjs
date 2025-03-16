import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {

  @UseGuards(LocalAuthGuard)
  @Post('login') // /api/v1/auth/login
  async login(@Request() req) {
    return req.user;
  }
}
