const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, PasswordResetToken } = require('../models');
const emailService = require('./emailService');
const logger = require('../config/logger');

const TOKEN_EXPIRY_HOURS = 1;

class PasswordResetService {
  /**
   * Request password reset - create token, save to DB, send email
   */
  async forgotPassword(emailAddress) {
    logger.info('PasswordResetService.forgotPassword() invoked');

    const user = await User.findOne({
      where: { emailAddress, isActive: true }
    });

    if (!user) {
      throw new Error('No active user found with this email address.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt,
      used: false
    });

    const resetPageUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`;
    const emailText = `Hello ${user.firstName},\n\nYou requested a password reset. Use the reset token code below on the reset password page (valid for ${TOKEN_EXPIRY_HOURS} hour(s)):\n\nReset token code: ${token}\n\nGo to: ${resetPageUrl}\nEnter the reset token code above and your new password.\n\nIf you did not request this, please ignore this email.`;

    await emailService.sendEmail(user.emailAddress, 'Password Reset Request', emailText);

    return { message: 'If an account exists with this email, a password reset token code has been sent.' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token, newPassword) {
    logger.info('PasswordResetService.resetPassword() invoked');

    const resetToken = await PasswordResetToken.findOne({
      where: { token, used: false },
      include: [{ model: User, as: 'user' }]
    });

    if (!resetToken) {
      throw new Error('Invalid or expired reset token.');
    }

    if (new Date() > resetToken.expiresAt) {
      await resetToken.update({ used: true });
      throw new Error('Reset token has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword, modifiedDate: new Date() },
      { where: { id: resetToken.userId } }
    );

    await resetToken.update({ used: true });

    return { message: 'Password has been reset successfully.' };
  }
}

module.exports = new PasswordResetService();
