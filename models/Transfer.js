const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'companyName'
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  deliveryDetails: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'deliveryDetails'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'transfer',
  timestamps: false
});

module.exports = Transfer;
