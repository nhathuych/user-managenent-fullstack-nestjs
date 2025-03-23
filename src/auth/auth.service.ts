import { comparePassword } from '@/helpers/password.helper';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAccountAuthDto } from './dto/verify-account-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    return await this.usersService.handleRegister(createAuthDto)
  }

  async verifyAccount(verifyAccountAuthDto: VerifyAccountAuthDto) {
    return await this.usersService.handleVerifyAccount(verifyAccountAuthDto)
  }

  async resendVerifyEmail(email: string) {
    return await this.usersService.resendVerifyEmail(email)
  }

  async sendResetPasswordEmail(email: string) {
    return await this.usersService.sendResetPasswordEmail(email)
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(updatePasswordDto)
  }
}
