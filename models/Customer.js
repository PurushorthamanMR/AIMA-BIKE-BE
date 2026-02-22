const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
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
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'address'
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'province'
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'district'
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'occupation'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'dateOfBirth'
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'religion'
  },
  contactNumber: {
    type: DataTypes.INTEGER,
    field: 'contactNumber'
  },
  whatsappNumber: {
    type: DataTypes.INTEGER,
    field: 'whatsappNumber'
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'nic'
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'modelId'
  },
  chassisNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'chassisNumber'
  },
  motorNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'motorNumber'
  },
  colorOfVehicle: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'colorOfVehicle'
  },
  dateOfPurchase: {
    type: DataTypes.DATEONLY,
    field: 'dateOfPurchase'
  },
  loyalityCardNo: {
    type: DataTypes.INTEGER,
    field: 'loyalityCardNo'
  },
  dateOfDelivery: {
    type: DataTypes.DATEONLY,
    field: 'dateOfDelivery'
  },
  sellingAmount: {
    type: DataTypes.DOUBLE,
    field: 'sellingAmount'
  },
  registrationFees: {
    type: DataTypes.DOUBLE,
    field: 'registrationFees'
  },
  advancePaymentAmount: {
    type: DataTypes.DOUBLE,
    field: 'advancePaymentAmount'
  },
  advancePaymentDate: {
    type: DataTypes.DATEONLY,
    field: 'advancePaymentDate'
  },
  balancePaymentAmount: {
    type: DataTypes.DOUBLE,
    field: 'balancePaymentAmount'
  },
  balancePaymentDate: {
    type: DataTypes.DATEONLY,
    field: 'balancePaymentDate'
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'paymentId'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'customer',
  timestamps: false
});

module.exports = Customer;
