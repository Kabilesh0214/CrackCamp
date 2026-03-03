import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

  // Transporter for building the mail service
  async sendOTP(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Actual mail
    await transporter.sendMail({
      from: `"CrackCamp"  <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });
  }
}