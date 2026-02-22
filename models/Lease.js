const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lease = sequelize.define('Lease', {
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
  companyName: {
    type: DataTypes.STRING,
    field: 'companyName'
  },
  purchaseOrderNumber: {
    type: DataTypes.INTEGER,
    field: 'purchaseOrderNumber'
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
  mta3: {
    type: DataTypes.STRING,
    field: 'mta3'
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
  tableName: 'lease',
  timestamps: false
});

module.exports = Lease;
