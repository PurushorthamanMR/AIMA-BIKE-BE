const express = require('express');
const router = express.Router();
const settingsService = require('../services/settingsService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Save a new setting
 * POST /settings/save
 */
router.post('/save', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.save() invoked');
    const dto = await settingsService.save(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error saving setting:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error saving setting', 500));
  }
});

/**
 * Update setting
 * POST /settings/update
 */
router.post('/update', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.update() invoked');
    const dto = await settingsService.update(req.body);
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error updating setting:', error);
    if (error.message === 'Setting not found') {
      res.status(404).json(responseUtil.getErrorServiceResponse(error.message, 404));
    } else {
      res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error updating setting', 500));
    }
  }
});

/**
 * Update admin status
 * PUT /settings/updateAdminStatus?settingsId=1&status=true
 */
router.put('/updateAdminStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.updateAdminStatus() invoked');
    const settingsId = parseInt(req.query.settingsId);
    const status = req.query.status === 'true';
    const dto = await settingsService.updateAdminStatus(settingsId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Setting not found', 404));
    }
  } catch (error) {
    logger.error('Error updating setting admin status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating setting admin status', 500));
  }
});

/**
 * Update manager status
 * PUT /settings/updateManagerStatus?settingsId=1&status=true
 */
router.put('/updateManagerStatus', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.updateManagerStatus() invoked');
    const settingsId = parseInt(req.query.settingsId);
    const status = req.query.status === 'true';
    const dto = await settingsService.updateManagerStatus(settingsId, status);
    if (dto) {
      res.json(responseUtil.getServiceResponse(dto));
    } else {
      res.status(404).json(responseUtil.getErrorServiceResponse('Setting not found', 404));
    }
  } catch (error) {
    logger.error('Error updating setting manager status:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error updating setting manager status', 500));
  }
});

/**
 * Get settings by name
 * GET /settings/getByName?name=...
 */
router.get('/getByName', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.getByName() invoked');
    const name = req.query.name;
    const list = await settingsService.getByName(name);
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error retrieving settings by name:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving settings by name', 500));
  }
});

/**
 * Get settings with pagination
 * GET /settings/getAllPagination?pageNumber=1&pageSize=10&name=...&isActiveAdmin=true&isActiveManager=true
 */
router.get('/getAllPagination', authenticateToken, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req, res) => {
  try {
    logger.info('SettingsController.getAllPagination() invoked');
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchParams = {};
    if (req.query.name) searchParams.name = req.query.name;
    if (req.query.isActiveAdmin !== undefined) searchParams.isActiveAdmin = req.query.isActiveAdmin;
    if (req.query.isActiveManager !== undefined) searchParams.isActiveManager = req.query.isActiveManager;
    const result = await settingsService.getAllPagination(pageNumber, pageSize, searchParams);
    res.json(responseUtil.getServiceResponse(result));
  } catch (error) {
    logger.error('Error retrieving settings page:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse('Error retrieving settings', 500));
  }
});

module.exports = router;
