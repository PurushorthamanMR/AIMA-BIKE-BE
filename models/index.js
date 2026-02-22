const { sequelize } = require('../config/database');
const UserRole = require('./UserRole');
const User = require('./User');
const UserLogs = require('./UserLogs');
const PasswordResetToken = require('./PasswordResetToken');
const Category = require('./Category');
const Model = require('./Model');
const Stock = require('./Stock');
const Payment = require('./Payment');
const Cash = require('./Cash');
const Lease = require('./Lease');
const Customer = require('./Customer');
const DealerConsignmentNote = require('./DealerConsignmentNote');
const DealerConsignmentNoteItem = require('./DealerConsignmentNoteItem');
const ShopDetail = require('./ShopDetail');

// Define associations
UserRole.hasMany(User, { foreignKey: 'userRoleId', as: 'users' });
User.belongsTo(UserRole, { foreignKey: 'userRoleId', as: 'userRole' });

UserLogs.belongsTo(User, { foreignKey: 'userId', as: 'user' });

PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens' });

Category.hasMany(Model, { foreignKey: 'categoryId', as: 'models' });
Model.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Model.hasMany(Stock, { foreignKey: 'modelId', as: 'stocks' });
Stock.belongsTo(Model, { foreignKey: 'modelId', as: 'model' });

Model.hasMany(Customer, { foreignKey: 'modelId', as: 'customers' });
Customer.belongsTo(Model, { foreignKey: 'modelId', as: 'model' });

Payment.hasMany(Customer, { foreignKey: 'paymentId', as: 'customers' });
Customer.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

DealerConsignmentNote.hasMany(DealerConsignmentNoteItem, { foreignKey: 'noteId', as: 'items' });
DealerConsignmentNoteItem.belongsTo(DealerConsignmentNote, { foreignKey: 'noteId', as: 'note' });
DealerConsignmentNoteItem.belongsTo(Model, { foreignKey: 'modelId', as: 'model' });
Model.hasMany(DealerConsignmentNoteItem, { foreignKey: 'modelId', as: 'dealerConsignmentNoteItems' });

module.exports = {
  sequelize,
  UserRole,
  User,
  UserLogs,
  PasswordResetToken,
  Category,
  Model,
  Stock,
  Payment,
  Cash,
  Lease,
  Customer,
  DealerConsignmentNote,
  DealerConsignmentNoteItem,
  ShopDetail
};
