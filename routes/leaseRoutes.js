const express = require('express');
const router = express.Router();
const leaseService = require('../services/leaseService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new lease record
 * POST /lease/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('LeaseController.save() invoked');
    const leaseDto = await leaseService.save(req.body);
    res.json(responseUtil.getServiceResponse(leaseDto));
  } catch (error) {
    logger.error('Error saving lease:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving lease', 500));
  }
});

/**
 * Update lease record
 * POST /lease/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('LeaseController.update() invoked');
    const leaseDto = await leaseService.update(req.body);
    res.json(responseUtil.getServiceResponse(leaseDto));
  } catch (error) {
    logger.error('Error updating lease:', error);
    if (error.message === 'Lease not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating lease', 500));
    }
  }
});

/**
 * Update lease status
 * PUT /lease/updateStatus?leaseId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('LeaseController.updateStatus() invoked');
    const leaseId = parseInt(req.query.leaseId);
    const status = req.query.status === 'true';
    const leaseDto = await leaseService.updateStatus(leaseId, status);
    if (leaseDto) {
      res.json(responseUtil.getServiceResponse(leaseDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Lease not found', 404));
    }
  } catch (error) {
    logger.error('Error updating lease status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating lease status', 500));
  }
});

/**
 * Get lease records by customer
 * GET /lease/getByCustomer?customerId=1
 */
router.get('/getByCustomer', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('LeaseController.getByCustomer() invoked');
    const customerId = parseInt(req.query.customerId);
    const list = await leaseService.getByCustomer(customerId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving lease by customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving lease by customer', 500));
  }
});

/**
 * Get lease records by company name (partial match)
 * GET /lease/getByCompany?companyName=...
 */
router.get('/getByCompany', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('LeaseController.getByCompany() invoked');
    const companyName = req.query.companyName;
    const list = await leaseService.getByCompany(companyName);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving lease by company:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving lease by company', 500));
  }
});

module.exports = router;
