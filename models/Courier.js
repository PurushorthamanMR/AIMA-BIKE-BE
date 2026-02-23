const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Courier = sequelize.define('Courier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'categoryId'
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customerId'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
  },
  contactNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'contactNumber'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'address'
  },
  sentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'sentDate'
  },
  receivedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'receivedDate'
  },
  receivername: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'receivername'
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nic'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'courier',
  timestamps: false
});

module.exports = Courier;
