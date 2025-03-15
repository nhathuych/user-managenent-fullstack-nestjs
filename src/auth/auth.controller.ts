import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // /api/v1/auth/login
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }
}
