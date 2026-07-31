import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/25
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(
    to: string,
    otp: string,
    purpose: 'verify-email' | 'reset' = 'verify-email',
  ) {
    const subject =
      purpose === 'verify-email'
        ? 'Verify your email'
        : 'Your verification code';

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>${subject}</h2>
        <p>Use the code below. It expires in ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send OTP email to ${to}`, err);
      throw err;
    }
  }
}
