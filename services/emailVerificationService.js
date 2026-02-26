const crypto = require('crypto');
const { EmailVerification } = require('../models');
const emailService = require('./emailService');
const jwtUtil = require('../utils/jwtUtil');
const logger = require('../config/logger');

const OTP_EXPIRY_MINUTES = 15;
const OTP_LENGTH = 6;

class EmailVerificationService {
  /**
   * Send OTP to email address. Stores OTP in DB with expiry.
   */
  async sendOtp(emailAddress) {
    logger.info('EmailVerificationService.sendOtp() invoked');
    if (!emailAddress || !String(emailAddress).trim()) {
      throw new Error('Email address is required');
    }
    const email = String(emailAddress).trim().toLowerCase();

    // Invalidate any existing OTP for this email
    await EmailVerification.destroy({ where: { emailAddress: email } });

    const otp = crypto.randomInt(0, Math.pow(10, OTP_LENGTH))
      .toString()
      .padStart(OTP_LENGTH, '0');
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await EmailVerification.create({
      emailAddress: email,
      otp,
      expiresAt
    });

    const text = `Your email verification OTP is: ${otp}\n\nValid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`;
    await emailService.sendEmail(email, 'Email Verification OTP', text);

    return { message: 'OTP sent to your email.' };
  }

  /**
   * Verify OTP. If valid, return short-lived JWT that can be sent when saving user with this email.
   */
  async verifyOtp(emailAddress, otp) {
    logger.info('EmailVerificationService.verifyOtp() invoked');
    if (!emailAddress || !otp) {
      throw new Error('Email address and OTP are required');
    }
    const email = String(emailAddress).trim().toLowerCase();
    const otpTrimmed = String(otp).trim();

    const record = await EmailVerification.findOne({
      where: { emailAddress: email }
    });

    if (!record) {
      throw new Error('Invalid or expired OTP. Please request a new one.');
    }
    if (new Date() > record.expiresAt) {
      await record.destroy();
      throw new Error('OTP has expired. Please request a new one.');
    }
    if (record.otp !== otpTrimmed) {
      throw new Error('Invalid OTP.');
    }

    await record.destroy();

    const token = jwtUtil.generateEmailVerificationToken({ emailVerified: email });
    return { success: true, emailVerificationToken: token };
  }
}

module.exports = new EmailVerificationService();
