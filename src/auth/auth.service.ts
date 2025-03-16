import { comparePassword } from '@/helpers/password.helper';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneBy(username);
    if (!user) return null;

    const isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    return await this.usersService.handleRegister(createAuthDto)
  }
}
