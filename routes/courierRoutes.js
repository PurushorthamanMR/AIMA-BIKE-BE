const express = require('express');
const router = express.Router();
const courierService = require('../services/courierService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new courier
 * POST /courier/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.save() invoked');
    const dto = await courierService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving courier:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving courier', 500));
  }
});

/**
 * Mark courier as received: save only receivedDate, receivername, nic
 * POST /courier/received
 * Body: { courierId (or id), receivedDate, receivername, nic }
 */
router.post('/received', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.received() invoked');
    const dto = await courierService.received(req.body);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Courier not found', 404));
    }
  } catch (error) {
    logger.error('Error updating courier received:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating courier received', 500));
  }
});

/**
 * Update courier
 * POST /courier/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.update() invoked');
    const dto = await courierService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating courier:', error);
    if (error.message === 'Courier not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating courier', 500));
    }
  }
});

/**
 * Update courier status
 * PUT /courier/updateStatus?courierId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.updateStatus() invoked');
    const courierId = parseInt(req.query.courierId);
    const status = req.query.status === 'true';
    const dto = await courierService.updateStatus(courierId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Courier not found', 404));
    }
  } catch (error) {
    logger.error('Error updating courier status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating courier status', 500));
  }
});

/**
 * Get courier by ID
 * GET /courier/getById?id=1
 */
router.get('/getById', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getById() invoked');
    const id = parseInt(req.query.id, 10);
    if (isNaN(id)) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('Invalid courier id', 400));
    }
    const dto = await courierService.getById(id);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Courier not found', 404));
    }
  } catch (error) {
    logger.error('Error retrieving courier by id:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving courier', 500));
  }
});

/**
 * Get couriers by category ID
 * GET /courier/getByCategoryId?categoryId=1
 */
router.get('/getByCategoryId', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getByCategoryId() invoked');
    const categoryId = parseInt(req.query.categoryId);
    const list = await courierService.getByCategoryId(categoryId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving couriers by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving couriers by category', 500));
  }
});

/**
 * Get couriers by customer ID
 * GET /courier/getByCustomerId?customerId=1
 */
router.get('/getByCustomerId', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getByCustomerId() invoked');
    const customerId = parseInt(req.query.customerId);
    const list = await courierService.getByCustomerId(customerId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving couriers by customer:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving couriers by customer', 500));
  }
});

/**
 * Get couriers by name
 * GET /courier/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getByName() invoked');
    const name = req.query.name;
    const list = await courierService.getByName(name);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving couriers by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving couriers by name', 500));
  }
});

/**
 * Get couriers by receiver name
 * GET /courier/getByReceiverName?receivername=...
 */
router.get('/getByReceiverName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getByReceiverName() invoked');
    const receivername = req.query.receivername;
    const list = await courierService.getByReceiverName(receivername);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving couriers by receiver name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving couriers by receiver name', 500));
  }
});

/**
 * Get couriers by sent date
 * GET /courier/getBySentDate?sentDate=YYYY-MM-DD
 * Omit sentDate to return all couriers.
 */
router.get('/getBySentDate', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getBySentDate() invoked');
    const sentDate = req.query.sentDate;
    const list = await courierService.getBySentDate(sentDate);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving couriers by sent date:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving couriers by sent date', 500));
  }
});

/**
 * Get couriers with pagination
 * GET /courier/getAllPage?pageNumber=1&pageSize=10&isActive=true&name=...&sentDate=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CourierController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const isActive = req.query.isActive;
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.sentDate) searchParams.sentDate = req.query.sentDate;
    const result = await courierService.getAllPage(pageNumber, pageSize, isActive, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving couriers page:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error retrieving couriers', 500));
  }
});

module.exports = router;
