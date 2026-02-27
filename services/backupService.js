const { sequelize } = require('../config/database');
const Backup = require('../models/Backup');
const logger = require('../config/logger');

const DB_NAME = process.env.DB_NAME || 'aima_bike_db';

/** MySQL dump-style header (structure and data) */
function mysqldumpHeader() {
  const now = new Date();
  const completed = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  return [
    '-- MySQL dump 10.13  Distrib 8.0 (compatible with MariaDB/MySQL)',
    '--',
    '-- Host: localhost    Database: ' + DB_NAME,
    '-- ------------------------------------------------------',
    '-- Server version\t8.0',
    '',
    '/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
    '/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;',
    '/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;',
    '/*!50503 SET NAMES utf8 */;',
    '/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;',
    '/*!40103 SET TIME_ZONE=\'+00:00\' */;',
    '/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;',
    '/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;',
    '/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=\'NO_AUTO_VALUE_ON_ZERO\' */;',
    '/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;',
    ''
  ].join('\n');
}

/** MySQL dump-style footer (restore session variables) */
function mysqldumpFooter(completedDate) {
  return [
    '/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;',
    '',
    '/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;',
    '/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;',
    '/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;',
    '/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;',
    '/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;',
    '/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;',
    '/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;',
    '',
    '-- Dump completed on ' + completedDate
  ].join('\n');
}

/**
 * Escape a value for use in MySQL INSERT statement
 */
function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (val instanceof Date) return "'" + val.toISOString().slice(0, 19).replace('T', ' ') + "'";
  const s = String(val);
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

/**
 * Generate SQL dump in MySQL dump format: structure (DDL) and data (INSERTs) separately
 * Returns { structureSql, dataSql }
 */
async function generateSqlDump() {
  const now = new Date();
  const completedDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');

  const structureLines = [mysqldumpHeader()];
  const dataLines = [mysqldumpHeader()];

  const [tableRows] = await sequelize.query("SHOW TABLES");
  const tableKey = tableRows[0] ? Object.keys(tableRows[0])[0] : null;
  const tables = tableKey ? tableRows.map((r) => r[tableKey]).filter(Boolean) : [];

  for (const table of tables) {
    if (table === 'backups') continue;

    // --- Structure (mysqldump style) ---
    structureLines.push('--');
    structureLines.push('-- Table structure for table `' + table + '`');
    structureLines.push('--');
    structureLines.push('');
    structureLines.push('DROP TABLE IF EXISTS `' + table + '`;');
    const [createRows] = await sequelize.query('SHOW CREATE TABLE `' + table.replace(/`/g, '') + '`');
    if (createRows && createRows[0]) {
      const createSql = createRows[0]['Create Table'];
      if (createSql) {
        structureLines.push('/*!40101 SET @saved_cs_client     = @@character_set_client */;');
        structureLines.push('/*!50503 SET character_set_client = utf8mb4 */;');
        structureLines.push(createSql + ';');
        structureLines.push('/*!40101 SET character_set_client = @saved_cs_client */;');
        structureLines.push('');
      }
    }

    // --- Data (mysqldump style: Dumping data, LOCK, DISABLE KEYS, INSERT VALUES (...),(...), ENABLE KEYS, UNLOCK) ---
    dataLines.push('--');
    dataLines.push('-- Dumping data for table `' + table + '`');
    dataLines.push('--');
    dataLines.push('');
    dataLines.push('LOCK TABLES `' + table + '` WRITE;');
    dataLines.push('/*!40000 ALTER TABLE `' + table + '` DISABLE KEYS */;');

    const [rows] = await sequelize.query('SELECT * FROM `' + table + '`');
    if (rows && rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const valueRows = rows.map((row) => {
        const values = columns.map((col) => escapeSqlValue(row[col]));
        return '(' + values.join(',') + ')';
      });
      dataLines.push('INSERT INTO `' + table + '` VALUES ' + valueRows.join(',') + ';');
    }

    dataLines.push('/*!40000 ALTER TABLE `' + table + '` ENABLE KEYS */;');
    dataLines.push('UNLOCK TABLES;');
    dataLines.push('');
  }

  structureLines.push(mysqldumpFooter(completedDate));
  dataLines.push(mysqldumpFooter(completedDate));

  return {
    structureSql: structureLines.join('\n'),
    dataSql: dataLines.join('\n')
  };
}

/**
 * Create a new backup and store in backups table (structure + data separate)
 */
async function createBackup() {
  const { structureSql, dataSql } = await generateSqlDump();
  const now = new Date();
  const filename = 'backup_' + now.toISOString().slice(0, 19).replace(/[-T:]/g, '-');

  const backup = await Backup.create({ filename, structureSql, dataSql });
  logger.info('Backup created: ' + filename + ', id=' + backup.id);
  return {
    id: backup.id,
    filename: backup.filename,
    createdAt: backup.createdAt
  };
}

/**
 * List all backups (newest first)
 */
async function getBackups() {
  const list = await Backup.findAll({
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'filename', 'createdAt']
  });
  return list.map((b) => ({
    id: b.id,
    filename: b.filename,
    createdAt: b.createdAt
  }));
}

/**
 * Get backup SQL for download (part: 'structure' | 'data')
 */
async function getBackupSqlById(id, part) {
  const backup = await Backup.findByPk(id, { attributes: ['id', 'filename', 'structureSql', 'dataSql'] });
  if (!backup) return null;
  const base = backup.filename.replace(/\.sql$/i, '');
  if (part === 'structure') {
    return { filename: base + '_structure.sql', sqlContent: backup.structureSql };
  }
  if (part === 'data') {
    return { filename: base + '_data.sql', sqlContent: backup.dataSql };
  }
  return null;
}

module.exports = {
  createBackup,
  getBackups,
  getBackupSqlById
};
