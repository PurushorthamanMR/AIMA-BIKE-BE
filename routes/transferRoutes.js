const express = require('express');
const router = express.Router();
const transferService = require('../services/transferService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new transfer
 * POST /transfer/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.save() invoked');
    const dto = await transferService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving transfer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving transfer', 500));
  }
});

/**
 * Update transfer
 * POST /transfer/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.update() invoked');
    const dto = await transferService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating transfer:', error);
    if (error.message === 'Transfer not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating transfer', 500));
    }
  }
});

/**
 * Update transfer status
 * PUT /transfer/updateStatus?transferId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.updateStatus() invoked');
    const transferId = parseInt(req.query.transferId);
    const status = req.query.status === 'true';
    const dto = await transferService.updateStatus(transferId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Transfer not found', 404));
    }
  } catch (error) {
    logger.error('Error updating transfer status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating transfer status', 500));
  }
});

/**
 * Get transfer by ID (transfer + transferList with stock, user)
 * GET /transfer/getById?id=1
 */
router.get('/getById', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getById() invoked');
    const id = parseInt(req.query.id, 10);
    if (isNaN(id)) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('Invalid transfer id', 400));
    }
    const dto = await transferService.getById(id);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Transfer not found', 404));
    }
  } catch (error) {
    logger.error('Error retrieving transfer by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving transfer', 500));
  }
});

/**
 * Get transfers by stock ID
 * GET /transfer/getByStockId?stockId=1
 */
router.get('/getByStockId', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getByStockId() invoked');
    const stockId = parseInt(req.query.stockId);
    const list = await transferService.getByStockId(stockId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving transfers by stock:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transfers by stock', 500));
  }
});

/**
 * Get transfers by company name
 * GET /transfer/getByCompanyName?companyName=...
 */
router.get('/getByCompanyName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getByCompanyName() invoked');
    const companyName = req.query.companyName;
    const list = await transferService.getByCompanyName(companyName);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving transfers by company name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transfers by company name', 500));
  }
});

/**
 * Get transfers by NIC
 * GET /transfer/getByNic?nic=...
 */
router.get('/getByNic', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getByNic() invoked');
    const nic = req.query.nic;
    const list = await transferService.getByNic(nic);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving transfers by NIC:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transfers by NIC', 500));
  }
});

/**
 * Get transfers by user ID
 * GET /transfer/getByUserId?userId=1
 */
router.get('/getByUserId', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getByUserId() invoked');
    const userId = parseInt(req.query.userId);
    const list = await transferService.getByUserId(userId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving transfers by user:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving transfers by user', 500));
  }
});

/**
 * Get transfers with pagination
 * GET /transfer/getAllPage?pageNumber=1&pageSize=10&isActive=true&companyName=...&nic=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('TransferController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const isActive = req.query.isActive;
    const searchParams = {};
    if (req.query.companyName) searchParams.companyName = req.query.companyName;
    if (req.query.nic) searchParams.nic = req.query.nic;
    const result = await transferService.getAllPage(pageNumber, pageSize, isActive, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving transfers page:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving transfers', 500));
  }
});

module.exports = router;
