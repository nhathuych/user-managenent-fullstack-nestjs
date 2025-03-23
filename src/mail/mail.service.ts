import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@/modules/users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your Email',
      template: 'account.activation.hbs',
      context: {
        name: user.name ?? user.email,
        activationCode: user.activationCode
      }
    });
  }

  async sendResetPasswordEmail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'account.activation.hbs',
      context: {
        name: user.name ?? user.email,
        activationCode: user.activationCode
      }
    });
  }
}
