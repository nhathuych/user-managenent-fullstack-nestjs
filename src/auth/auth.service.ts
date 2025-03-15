import { comparePassword } from '@/helpers/password.helper';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email: string, plainPassword: string): Promise<any> {
    const user = await this.usersService.findOneBy(email);
    if (!user) throw new UnauthorizedException();

    const isValidPassword = await comparePassword(plainPassword, user.password);
    if (!isValidPassword) throw new UnauthorizedException();

    const payload = { _id: user._id }

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
