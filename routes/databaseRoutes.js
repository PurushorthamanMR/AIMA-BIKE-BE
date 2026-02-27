const express = require('express');
const router = express.Router();
const backupService = require('../services/backupService');
const responseUtil = require('../utils/responseUtil');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

/**
 * Create a new backup (Admin only)
 * POST /database/backup
 */
router.post('/backup', authenticateToken, authorize('ADMIN'), async (req, res) => {
  try {
    logger.info('DatabaseController.createBackup() invoked');
    const dto = await backupService.createBackup();
    res.json(responseUtil.getServiceResponse(dto));
  } catch (error) {
    logger.error('Error creating backup:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error creating backup', 500));
  }
});

/**
 * List all backups
 * GET /database/backups
 */
router.get('/backups', authenticateToken, async (req, res) => {
  try {
    const list = await backupService.getBackups();
    res.json(responseUtil.getServiceResponse(list));
  } catch (error) {
    logger.error('Error listing backups:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error listing backups', 500));
  }
});

/**
 * Download backup SQL file by id
 * GET /database/backups/:id/download?part=structure|data
 */
router.get('/backups/:id/download', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const part = (req.query.part || 'structure').toLowerCase();
    if (isNaN(id)) {
      return res.status(400).json(responseUtil.getErrorServiceResponse('Invalid backup id', 400));
    }
    if (part !== 'structure' && part !== 'data') {
      return res.status(400).json(responseUtil.getErrorServiceResponse('Invalid part: use structure or data', 400));
    }
    const backup = await backupService.getBackupSqlById(id, part);
    if (!backup) {
      return res.status(404).json(responseUtil.getErrorServiceResponse('Backup not found', 404));
    }
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="' + backup.filename + '"');
    res.send(backup.sqlContent);
  } catch (error) {
    logger.error('Error downloading backup:', error);
    res.status(500).json(responseUtil.getErrorServiceResponse(error.message || 'Error downloading backup', 500));
  }
});

module.exports = router;
