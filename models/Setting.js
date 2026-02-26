const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
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
  isActiveAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActiveAdmin'
  },
  isActiveManager: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActiveManager'
  }
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Setting;
