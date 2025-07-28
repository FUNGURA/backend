import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  // send confirmation email
  async sendResetEmail(email: string, user: User, otp: string) {
    const fullName = `${user.firstname} ${user.lastname}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: './resetPassword',
      context: {
        name: fullName,
        otp,
      },
    });
  }
}