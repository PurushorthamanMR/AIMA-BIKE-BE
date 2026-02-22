const express = require('express');
const router = express.Router();
const dealerConsignmentNoteService = require('../services/dealerConsignmentNoteService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new dealer consignment note (header + items)
 * POST /dealerConsignmentNote/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.save() invoked');
    const dto = await dealerConsignmentNoteService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving dealer consignment note:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving dealer consignment note', 500));
  }
});

/**
 * Get all dealer consignment notes with pagination
 * GET /dealerConsignmentNote/getAllPage?pageNumber=1&pageSize=10&status=true&dealerCode=...&dealerName=...&consignmentNoteNo=...
 */
router.get('/getAllPage', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.getAllPage() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status !== undefined ? req.query.status === 'true' : undefined;
    const searchParams = {};
    if (req.query.dealerCode) searchParams.dealerCode = req.query.dealerCode;
    if (req.query.dealerName) searchParams.dealerName = req.query.dealerName;
    if (req.query.consignmentNoteNo) searchParams.consignmentNoteNo = req.query.consignmentNoteNo;

    const result = await dealerConsignmentNoteService.getAllPage(pageNumber, pageSize, status, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving dealer consignment notes:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving dealer consignment notes', 500));
  }
});

/**
 * Get notes by dealer code
 * GET /dealerConsignmentNote/getByDealerCode?dealerCode=...
 */
router.get('/getByDealerCode', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.getByDealerCode() invoked');
    const dealerCode = req.query.dealerCode;
    const notes = await dealerConsignmentNoteService.getByDealerCode(dealerCode);
    res.json(responseUtil.getServiceResponse(notes));
  } catch (error) {
    logger.error('Error retrieving by dealer code:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving by dealer code', 500));
  }
});

/**
 * Get notes by dealer name
 * GET /dealerConsignmentNote/getByDealerName?dealerName=...
 */
router.get('/getByDealerName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.getByDealerName() invoked');
    const dealerName = req.query.dealerName;
    const notes = await dealerConsignmentNoteService.getByDealerName(dealerName);
    res.json(responseUtil.getServiceResponse(notes));
  } catch (error) {
    logger.error('Error retrieving by dealer name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving by dealer name', 500));
  }
});

/**
 * Get note by consignment note number
 * GET /dealerConsignmentNote/getByConsignmentNoteNo?consignmentNoteNo=...
 */
router.get('/getByConsignmentNoteNo', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.getByConsignmentNoteNo() invoked');
    const consignmentNoteNo = req.query.consignmentNoteNo;
    const note = await dealerConsignmentNoteService.getByConsignmentNoteNo(consignmentNoteNo);
    if (note) {
      res.json(responseUtil.getServiceResponse(note));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Dealer consignment note not found', 404));
    }
  } catch (error) {
    logger.error('Error retrieving by consignment note no:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving by consignment note no', 500));
  }
});

/**
 * Update dealer consignment note (header + items)
 * POST /dealerConsignmentNote/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.update() invoked');
    const dto = await dealerConsignmentNoteService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating dealer consignment note:', error);
    if (error.message === 'Dealer consignment note not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating dealer consignment note', 500));
    }
  }
});

/**
 * Update note status
 * PUT /dealerConsignmentNote/updateStatus?noteId=1&status=true
 */
router.put('/updateStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('DealerConsignmentNoteController.updateStatus() invoked');
    const noteId = parseInt(req.query.noteId);
    const status = req.query.status === 'true';
    const dto = await dealerConsignmentNoteService.updateStatus(noteId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Dealer consignment note not found', 404));
    }
  } catch (error) {
    logger.error('Error updating dealer consignment note status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating dealer consignment note status', 500));
  }
});

module.exports = router;
