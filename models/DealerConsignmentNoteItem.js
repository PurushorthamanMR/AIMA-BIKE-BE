const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DealerConsignmentNoteItem = sequelize.define('DealerConsignmentNoteItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'noteId'
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'modelId'
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'stockId',
    references: { model: 'stock', key: 'id' }
  },
  itemCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'itemCode'
  },
  chassisNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'chassisNumber'
  },
  motorNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'motorNumber'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'color'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'quantity'
  }
}, {
  tableName: 'dealerConsignmentNoteItem',
  timestamps: false
});

module.exports = DealerConsignmentNoteItem;
