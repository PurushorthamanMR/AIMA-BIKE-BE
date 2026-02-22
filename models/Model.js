const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Model = sequelize.define('Model', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
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
  tableName: 'model',
  timestamps: false
});

module.exports = Model;
