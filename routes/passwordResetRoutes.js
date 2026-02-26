const express = require('express');
const router = express.Router();
const passwordResetService = require('../services/passwordResetService');
const emailVerificationService = require('../services/emailVerificationService');
const responseUtil = require('../utils/responseUtil');
const logger = require('../config/logger');

/**
 * Send email verification OTP
 * POST /auth/send-email-otp
 * Body: { "emailAddress": "user@example.com" }
 */
router.post('/send-email-otp', async (req, res) => {
  try {
    logger.info('AuthController.sendEmailOtp() invoked');
    const { emailAddress } = req.body;
    if (!emailAddress) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('emailAddress is required', 400));
    }
    const result = await emailVerificationService.sendOtp(emailAddress);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error sending email OTP:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error sending OTP', 500));
  }
});

/**
 * Verify email OTP - returns short-lived emailVerificationToken
 * POST /auth/verify-email-otp
 * Body: { "emailAddress": "user@example.com", "otp": "123456" }
 */
router.post('/verify-email-otp', async (req, res) => {
  try {
    logger.info('AuthController.verifyEmailOtp() invoked');
    const { emailAddress, otp } = req.body;
    if (!emailAddress || !otp) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('emailAddress and otp are required', 400));
    }
    const result = await emailVerificationService.verifyOtp(emailAddress, otp);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error verifying email OTP:', error);
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(400).json(responseUtil.getErrorServiceResponse(error.message, 400));
    }
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error verifying OTP', 500));
  }
});

/**
 * Request password reset (forgot password)
 * POST /auth/forgot-password
 * Body: { "emailAddress": "user@example.com" }
 */
router.post('/forgot-password', async (req, res) => {
  try {
    logger.info('PasswordResetController.forgotPassword() invoked');
    const { emailAddress } = req.body;
    if (!emailAddress) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('emailAddress is required', 400));
    }
    const result = await passwordResetService.forgotPassword(emailAddress);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error in forgot password:', error);
    if (error.message.includes('No active user')) {
      return res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    }
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error processing forgot password', 500));
  }
});

/**
 * Reset password with token
 * POST /auth/reset-password
 * Body: { "token": "...", "newPassword": "newpassword123" }
 */
router.post('/reset-password', async (req, res) => {
  try {
    logger.info('PasswordResetController.resetPassword() invoked');
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('token and newPassword are required', 400));
    }
    const result = await passwordResetService.resetPassword(token, newPassword);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error in reset password:', error);
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(400).json(responseUtil.getErrorServiceResponse(error.message, 400));
    }
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error resetting password', 500));
  }
});

module.exports = router;
