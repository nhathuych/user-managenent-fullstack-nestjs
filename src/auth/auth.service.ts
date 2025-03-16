import { comparePassword } from '@/helpers/password.helper';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
}
