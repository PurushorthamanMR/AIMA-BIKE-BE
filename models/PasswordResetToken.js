const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'token'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiresAt'
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'used'
  }
}, {
  tableName: 'passwordResetToken',
  timestamps: false
});

module.exports = PasswordResetToken;
