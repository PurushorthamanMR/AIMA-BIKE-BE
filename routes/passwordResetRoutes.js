const express = require('express');
const router = express.Router();
const passwordResetService = require('../services/passwordResetService');
const responseUtil = require('../utils/responseUtil');
const logger = require('../config/logger');

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
