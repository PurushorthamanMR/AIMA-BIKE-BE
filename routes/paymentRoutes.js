const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new payment
 * POST /payment/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('PaymentController.save() invoked');
    const paymentDto = await paymentService.save(req.body);
    res.json(responseUtil.getServiceResponse(paymentDto));
  } catch (error) {
    logger.error('Error saving payment:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving payment', 500));
  }
});

/**
 * Get payments by name
 * GET /payment/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('PaymentController.getByName() invoked');
    const name = req.query.name;
    const payments = await paymentService.getByName(name);
    res.json(responseUtil.getServiceResponse(payments));
  } catch (error) {
    logger.error('Error retrieving payment by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving payment by name', 500));
  }
});

/**
 * Update payment
 * POST /payment/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('PaymentController.update() invoked');
    const paymentDto = await paymentService.update(req.body);
    res.json(responseUtil.getServiceResponse(paymentDto));
  } catch (error) {
    logger.error('Error updating payment:', error);
    if (error.message === 'Payment not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating payment', 500));
    }
  }
});

/**
 * Update payment status
 * PUT /payment/updateStatus?paymentId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('PaymentController.updateStatus() invoked');
    const paymentId = parseInt(req.query.paymentId);
    const status = req.query.status === 'true';
    const paymentDto = await paymentService.updateStatus(paymentId, status);
    if (paymentDto) {
      res.json(responseUtil.getServiceResponse(paymentDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Payment not found', 404));
    }
  } catch (error) {
    logger.error('Error updating payment status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating payment status', 500));
  }
});

module.exports = router;
