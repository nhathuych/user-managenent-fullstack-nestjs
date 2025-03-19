import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/decorators/skip-auth';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailService } from '@/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
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
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @SkipAuth()
  @Get('send-mail')
  sendMail() {
    this.mailService.sendUserConfirmation();
    return "sent"
  }
}
