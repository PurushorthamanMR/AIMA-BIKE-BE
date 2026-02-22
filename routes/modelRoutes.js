const express = require('express');
const router = express.Router();
const modelService = require('../services/modelService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new model
 * POST /model/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.save() invoked');
    const modelDto = await modelService.save(req.body);
    res.json(responseUtil.getServiceResponse(modelDto));
  } catch (error) {
    logger.error('Error saving model:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving model', 500));
  }
});

/**
 * Get all models with pagination
 * GET /model/getAllPage?pageNumber=1&pageSize=10&status=true&name=...&categoryId=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.categoryId != null) searchParams.categoryId = parseInt(req.query.categoryId);

    const result = await modelService.getAllPage(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving models:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving models', 500));
  }
});

/**
 * Get models by name
 * GET /model/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.getByName() invoked');
    const name = req.query.name;
    const models = await modelService.getByName(name);
    res.json(responseUtil.getServiceResponse(models));
  } catch (error) {
    logger.error('Error retrieving model by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving model by name', 500));
  }
});

/**
 * Get models by category
 * GET /model/getByCategory?categoryId=1
 */
router.get('/getByCategory', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.getByCategory() invoked');
    const categoryId = parseInt(req.query.categoryId);
    const models = await modelService.getByCategory(categoryId);
    res.json(responseUtil.getServiceResponse(models));
  } catch (error) {
    logger.error('Error retrieving models by category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving models by category', 500));
  }
});

/**
 * Update model
 * POST /model/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.update() invoked');
    const modelDto = await modelService.update(req.body);
    res.json(responseUtil.getServiceResponse(modelDto));
  } catch (error) {
    logger.error('Error updating model:', error);
    if (error.message === 'Model not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating model', 500));
    }
  }
});

/**
 * Update model status
 * PUT /model/updateStatus?modelId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('ModelController.updateStatus() invoked');
    const modelId = parseInt(req.query.modelId);
    const status = req.query.status === 'true';
    const modelDto = await modelService.updateStatus(modelId, status);
    if (modelDto) {
      res.json(responseUtil.getServiceResponse(modelDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Model not found', 404));
    }
  } catch (error) {
    logger.error('Error updating model status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating model status', 500));
  }
});

module.exports = router;
