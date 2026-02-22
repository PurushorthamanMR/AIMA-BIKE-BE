const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShopDetail = sequelize.define('ShopDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'logo'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'address'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'phoneNumber'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'shopDetails',
  timestamps: false
});

module.exports = ShopDetail;
