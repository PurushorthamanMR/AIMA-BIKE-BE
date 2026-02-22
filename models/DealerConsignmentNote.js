const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DealerConsignmentNote = sequelize.define('DealerConsignmentNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dealerCode: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'dealerCode'
  },
  dealerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'dealerName'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'address'
  },
  consignmentNoteNo: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'consignmentNoteNo'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date'
  },
  deliveryMode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'deliveryMode'
  },
  vehicleNo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'vehicleNo'
  },
  references: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'references'
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'contactPerson'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'isActive'
  }
}, {
  tableName: 'dealerConsignmentNote',
  timestamps: false
});

module.exports = DealerConsignmentNote;
