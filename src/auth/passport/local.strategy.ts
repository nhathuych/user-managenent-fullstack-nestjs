
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private authService: AuthService) {
    // Mặc định thư viện muốn body phải truyền đúng định dạng là username, password như vầy:
    // {
    //   "username": "your username",
    //   "password": "your password"
    // }
    super();

    // Nếu muốn dùng 'email' thay cho 'username' thì làm như vầy:
    // super({ usernameField: 'email' }); // 👈 Đổi 'username' thành 'email'
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    if (!user.isActive) throw new UnauthorizedException('Your account has not been activated.');

    return user;
  }
}
