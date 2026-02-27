const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Get sales report by period
 * GET /report/sales?period=daily|monthly|yearly
 */
router.get('/sales', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    const period = (req.query.period || 'daily').toLowerCase();
    if (!['daily', 'monthly', 'yearly'].includes(period)) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('Invalid period. Use daily, monthly, or yearly.', 400));
    }
    const result = await reportService.getSalesReport(period);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving report:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving report', 500));
  }
});

module.exports = router;
