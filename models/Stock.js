const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stock = sequelize.define('Stock', {
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
  tableName: 'stock',
  timestamps: false
});

module.exports = Stock;
