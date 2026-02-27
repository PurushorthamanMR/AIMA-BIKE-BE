const { sequelize } = require('../config/database');
const Backup = require('../models/Backup');
const logger = require('../config/logger');

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
 * Generate SQL dump: structure (DDL) and data (INSERTs) separately
 * Returns { structureSql, dataSql }
 */
async function generateSqlDump() {
  const header = '-- AIMA Bike DB Backup\n-- Generated: ' + new Date().toISOString() + '\n\n';
  const structureLines = [header];
  const dataLines = [header];

  const [tableRows] = await sequelize.query("SHOW TABLES");
  const tableKey = tableRows[0] ? Object.keys(tableRows[0])[0] : null;
  const tables = tableKey ? tableRows.map((r) => r[tableKey]).filter(Boolean) : [];

  for (const table of tables) {
    if (table === 'backups') continue;

    structureLines.push('-- Table: ' + table);
    const [createRows] = await sequelize.query('SHOW CREATE TABLE `' + table.replace(/`/g, '') + '`');
    if (createRows && createRows[0]) {
      const createSql = createRows[0]['Create Table'];
      if (createSql) {
        structureLines.push('DROP TABLE IF EXISTS `' + table + '`;');
        structureLines.push(createSql + ';');
        structureLines.push('');
      }
    }

    const [rows] = await sequelize.query('SELECT * FROM `' + table + '`');
    if (rows && rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const colList = columns.map((c) => '`' + c + '`').join(', ');
      dataLines.push('-- Data: ' + table);
      dataLines.push('LOCK TABLES `' + table + '` WRITE;');
      for (const row of rows) {
        const values = columns.map((col) => escapeSqlValue(row[col]));
        dataLines.push('INSERT INTO `' + table + '` (' + colList + ') VALUES (' + values.join(',') + ');');
      }
      dataLines.push('UNLOCK TABLES;');
      dataLines.push('');
    }
  }

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
