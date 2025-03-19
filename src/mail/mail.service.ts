import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation() {
    await this.mailerService.sendMail({
      to: 'huydqn@vnext.vn',
      subject: 'Confirm your Email',
      html: '<h1>Hello world!</h1>',
    });
  }
}
