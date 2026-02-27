const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Backup = sequelize.define('Backup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'filename'
  },
  structureSql: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    field: 'structureSql'
  },
  dataSql: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    field: 'dataSql'
  }
}, {
  tableName: 'backups',
  timestamps: true,
  createdAt: true,
  updatedAt: false
});

module.exports = Backup;
