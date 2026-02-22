const express = require('express');
const router = express.Router();
const cashService = require('../services/cashService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new cash record
 * POST /cash/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CashController.save() invoked');
    const cashDto = await cashService.save(req.body);
    res.json(responseUtil.getServiceResponse(cashDto));
  } catch (error) {
    logger.error('Error saving cash:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving cash', 500));
  }
});

/**
 * Update cash record
 * POST /cash/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CashController.update() invoked');
    const cashDto = await cashService.update(req.body);
    res.json(responseUtil.getServiceResponse(cashDto));
  } catch (error) {
    logger.error('Error updating cash:', error);
    if (error.message === 'Cash not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating cash', 500));
    }
  }
});

/**
 * Update cash status
 * PUT /cash/updateStatus?cashId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CashController.updateStatus() invoked');
    const cashId = parseInt(req.query.cashId);
    const status = req.query.status === 'true';
    const cashDto = await cashService.updateStatus(cashId, status);
    if (cashDto) {
      res.json(responseUtil.getServiceResponse(cashDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Cash not found', 404));
    }
  } catch (error) {
    logger.error('Error updating cash status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating cash status', 500));
  }
});

/**
 * Get cash records by customer
 * GET /cash/getByCustomer?customerId=1
 */
router.get('/getByCustomer', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CashController.getByCustomer() invoked');
    const customerId = parseInt(req.query.customerId);
    const list = await cashService.getByCustomer(customerId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving cash by customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving cash by customer', 500));
  }
});

module.exports = router;
