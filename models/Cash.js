const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cash = sequelize.define('Cash', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customerId'
  },
  copyOfNic: {
    type: DataTypes.STRING,
    field: 'copyOfNic'
  },
  photographOne: {
    type: DataTypes.STRING,
    field: 'photographOne'
  },
  photographTwo: {
    type: DataTypes.STRING,
    field: 'photographTwo'
  },
  paymentReceipt: {
    type: DataTypes.STRING,
    field: 'paymentReceipt'
  },
  mta2: {
    type: DataTypes.STRING,
    field: 'mta2'
  },
  slip: {
    type: DataTypes.STRING,
    field: 'slip'
  },
  chequeNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'chequeNumber'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'cash',
  timestamps: false
});

module.exports = Cash;
