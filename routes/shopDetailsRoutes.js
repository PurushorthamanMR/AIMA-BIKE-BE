const express = require('express');
const router = express.Router();
const shopDetailsService = require('../services/shopDetailsService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new shop detail
 * POST /shopDetails/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.save() invoked');
    const dto = await shopDetailsService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving shop detail:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving shop detail', 500));
  }
});

/**
 * Get all shop details
 * GET /shopDetails/getAll
 */
router.get('/getAll', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.getAll() invoked');
    const list = await shopDetailsService.getAll();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving shop details:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving shop details', 500));
  }
});

/**
 * Update shop detail
 * POST /shopDetails/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.update() invoked');
    const dto = await shopDetailsService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating shop detail:', error);
    if (error.message === 'Shop detail not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating shop detail', 500));
    }
  }
});

/**
 * Update shop detail status
 * PUT /shopDetails/updateStatus?shopId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ShopDetailsController.updateStatus() invoked');
    const shopId = parseInt(req.query.shopId);
    const status = req.query.status === 'true';
    const dto = await shopDetailsService.updateStatus(shopId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Shop detail not found', 404));
    }
  } catch (error) {
    logger.error('Error updating shop detail status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating shop detail status', 500));
  }
});

module.exports = router;
