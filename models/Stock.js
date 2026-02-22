const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'modelId'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'color'
  },
  sellingAmount: {
    type: DataTypes.DOUBLE,
    field: 'sellingAmount'
  },
  quantity: {
    type: DataTypes.INTEGER,
    field: 'quantity'
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'imageUrl'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'stock',
  timestamps: false
});

module.exports = Stock;
