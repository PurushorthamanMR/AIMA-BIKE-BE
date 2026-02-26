const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailVerification = sequelize.define('EmailVerification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'emailAddress'
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'otp'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiresAt'
  }
}, {
  tableName: 'email_verification',
  timestamps: false
});

module.exports = EmailVerification;
