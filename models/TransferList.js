const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransferList = sequelize.define('TransferList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transferId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transferId',
    references: {
      model: 'transfer',
      key: 'id'
    }
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'stockId',
    references: {
      model: 'stock',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity'
  }
}, {
  tableName: 'transferlist',
  timestamps: false
});

module.exports = TransferList;
