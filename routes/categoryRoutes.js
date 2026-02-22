const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new category
 * POST /category/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CategoryController.save() invoked');
    const categoryDto = await categoryService.save(req.body);
    res.json(responseUtil.getServiceResponse(categoryDto));
  } catch (error) {
    logger.error('Error saving category:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving category', 500));
  }
});

/**
 * Get all categories with pagination
 * GET /category/getAllPage?pageNumber=1&pageSize=10&status=true&name=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CategoryController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;

    const result = await categoryService.getAllPage(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving categories:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving categories', 500));
  }
});

/**
 * Get categories by name
 * GET /category/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CategoryController.getByName() invoked');
    const name = req.query.name;
    const categories = await categoryService.getByName(name);
    res.json(responseUtil.getServiceResponse(categories));
  } catch (error) {
    logger.error('Error retrieving category by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving category by name', 500));
  }
});

/**
 * Update category
 * POST /category/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CategoryController.update() invoked');
    const categoryDto = await categoryService.update(req.body);
    res.json(responseUtil.getServiceResponse(categoryDto));
  } catch (error) {
    logger.error('Error updating category:', error);
    if (error.message === 'Category not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating category', 500));
    }
  }
});

/**
 * Update category status
 * PUT /category/updateStatus?categoryId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('CategoryController.updateStatus() invoked');
    const categoryId = parseInt(req.query.categoryId);
    const status = req.query.status === 'true';
    const categoryDto = await categoryService.updateStatus(categoryId, status);
    if (categoryDto) {
      res.json(responseUtil.getServiceResponse(categoryDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Category not found', 404));
    }
  } catch (error) {
    logger.error('Error updating category status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating category status', 500));
  }
});

module.exports = router;
