const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save customer + Lease OR Cash (customer chooses one option).
 * POST /customer/saveWithPaymentOption
 * Body: { ...customerFields, paymentOption: 'lease'|'cash', leaseData?: {...}, cashData?: {...} }
 * - If paymentOption === 'lease', include leaseData (companyName, purchaseOrderNumber, copyOfNic, photographOne, photographTwo, paymentReceipt, mta2, mta3, chequeNumber, etc.)
 * - If paymentOption === 'cash', include cashData (copyOfNic, photographOne, photographTwo, paymentReceipt, mta2, slip, chequeNumber, etc.)
 */
router.post('/saveWithPaymentOption', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.saveWithPaymentOption() invoked');
    const result = await customerService.saveWithPaymentOption(req.body);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error saving customer with payment option:', error);
    const isValidation = error.message && (error.message.includes('not found') || error.message.includes('Model with') || error.message.includes('Payment with'));
    res.status(isValidation ? 400 : 500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving customer with payment option', isValidation ? 400 : 500));
  }
});

/**
 * Get all customers with pagination
 * GET /customer/getAllPage?pageNumber=1&pageSize=10&status=true&name=...&colorOfVehicle=...&modelId=...&paymentId=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.colorOfVehicle) searchParams.colorOfVehicle = req.query.colorOfVehicle;
    if (req.query.modelId != null) searchParams.modelId = parseInt(req.query.modelId);
    if (req.query.paymentId != null) searchParams.paymentId = parseInt(req.query.paymentId);

    const result = await customerService.getAllPage(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving customers:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customers', 500));
  }
});

/**
 * Get customers by name
 * GET /customer/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getByName() invoked');
    const name = req.query.name;
    const list = await customerService.getByName(name);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving customer by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by name', 500));
  }
});

/**
 * Get customers by vehicle color
 * GET /customer/getByColor?colorOfVehicle=...
 */
router.get('/getByColor', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getByColor() invoked');
    const colorOfVehicle = req.query.colorOfVehicle;
    const list = await customerService.getByColor(colorOfVehicle);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving customer by color:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by color', 500));
  }
});

/**
 * Get customers by model
 * GET /customer/getByModel?modelId=1
 */
router.get('/getByModel', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getByModel() invoked');
    const modelId = parseInt(req.query.modelId);
    const list = await customerService.getByModel(modelId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving customer by model:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by model', 500));
  }
});

/**
 * Get customers by payment
 * GET /customer/getByPayment?paymentId=1
 */
router.get('/getByPayment', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.getByPayment() invoked');
    const paymentId = parseInt(req.query.paymentId);
    const list = await customerService.getByPayment(paymentId);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving customer by payment:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving customer by payment', 500));
  }
});

/**
 * Update customer
 * POST /customer/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.update() invoked');
    const customerDto = await customerService.update(req.body);
    res.json(responseUtil.getServiceResponse(customerDto));
  } catch (error) {
    logger.error('Error updating customer:', error);
    if (error.message === 'Customer not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating customer', 500));
    }
  }
});

/**
 * Update customer status
 * PUT /customer/updateStatus?customerId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CustomerController.updateStatus() invoked');
    const customerId = parseInt(req.query.customerId);
    const status = req.query.status === 'true';
    const customerDto = await customerService.updateStatus(customerId, status);
    if (customerDto) {
      res.json(responseUtil.getServiceResponse(customerDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Customer not found', 404));
    }
  } catch (error) {
    logger.error('Error updating customer status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating customer status', 500));
  }
});

module.exports = router;
