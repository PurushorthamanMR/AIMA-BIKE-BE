const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new stock
 * POST /stock/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.save() invoked');
    const stockDto = await stockService.save(req.body);
    res.json(responseUtil.getServiceResponse(stockDto));
  } catch (error) {
    logger.error('Error saving stock:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving stock', 500));
  }
});

/**
 * Get all stock with pagination
 * GET /stock/getAllPage?pageNumber=1&pageSize=10&noteId=...&color=...&modelId=...&itemCode=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchParams = {};
    if (req.query.noteId != null) searchParams.noteId = parseInt(req.query.noteId);
    if (req.query.color) searchParams.color = req.query.color;
    if (req.query.modelId != null) searchParams.modelId = parseInt(req.query.modelId);
    if (req.query.itemCode) searchParams.itemCode = req.query.itemCode;

    const result = await stockService.getAllPage(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving stock:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock', 500));
  }
});

/**
 * Get stock by note ID
 * GET /stock/getByNoteId?noteId=1
 */
router.get('/getByNoteId', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByNoteId() invoked');
    const noteId = parseInt(req.query.noteId);
    const stocks = await stockService.getByNoteId(noteId);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by note:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by note', 500));
  }
});

/**
 * Get stock by name (searches itemCode)
 * GET /stock/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByName() invoked');
    const name = req.query.name;
    const stocks = await stockService.getByName(name);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by name', 500));
  }
});

/**
 * Get stock by color
 * GET /stock/getByColor?color=...
 */
router.get('/getByColor', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByColor() invoked');
    const color = req.query.color;
    const stocks = await stockService.getByColor(color);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by color:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by color', 500));
  }
});

/**
 * Get stock by model
 * GET /stock/getByModel?modelId=1
 */
router.get('/getByModel', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.getByModel() invoked');
    const modelId = parseInt(req.query.modelId);
    const stocks = await stockService.getByModel(modelId);
    res.json(responseUtil.getServiceResponse(stocks));
  } catch (error) {
    logger.error('Error retrieving stock by model:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving stock by model', 500));
  }
});

/**
 * Update stock
 * POST /stock/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.update() invoked');
    const stockDto = await stockService.update(req.body);
    res.json(responseUtil.getServiceResponse(stockDto));
  } catch (error) {
    logger.error('Error updating stock:', error);
    if (error.message === 'Stock not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating stock', 500));
    }
  }
});

/**
 * Add quantity to current stock (e.g. current 50 + quantity 50 => 100)
 * PUT /stock/updateQuantity?stockId=1&quantity=50
 */
router.put('/updateQuantity', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('StockController.updateQuantity() invoked');
    const stockId = parseInt(req.query.stockId);
    const quantity = parseInt(req.query.quantity) || 0;
    const stockDto = await stockService.updateQuantity(stockId, quantity);
    if (stockDto) {
      res.json(responseUtil.getServiceResponse(stockDto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Stock not found', 404));
    }
  } catch (error) {
    logger.error('Error updating stock quantity:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating stock quantity', 500));
  }
});

module.exports = router;
