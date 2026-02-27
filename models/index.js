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
const ShopDetail = require('./ShopDetail');
const Courier = require('./Courier');
const Transfer = require('./Transfer');
const TransferList = require('./TransferList');
const Setting = require('./Setting');
const EmailVerification = require('./EmailVerification');
const Backup = require('./Backup');

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

Customer.hasMany(Cash, { foreignKey: 'customerId', as: 'cash' });
Cash.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Lease, { foreignKey: 'customerId', as: 'lease' });
Lease.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

DealerConsignmentNote.hasMany(Stock, { foreignKey: 'noteId', as: 'items' });
Stock.belongsTo(DealerConsignmentNote, { foreignKey: 'noteId', as: 'note' });

Category.hasMany(Courier, { foreignKey: 'categoryId', as: 'couriers' });
Courier.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Customer.hasMany(Courier, { foreignKey: 'customerId', as: 'couriers' });
Courier.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

User.hasMany(Transfer, { foreignKey: 'userId', as: 'transfers' });
Transfer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Transfer.hasMany(TransferList, { foreignKey: 'transferId', as: 'transferList' });
TransferList.belongsTo(Transfer, { foreignKey: 'transferId', as: 'transfer' });
Stock.hasMany(TransferList, { foreignKey: 'stockId', as: 'transferListItems' });
TransferList.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });

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
  ShopDetail,
  Courier,
  Transfer,
  TransferList,
  Setting,
  EmailVerification,
  Backup
};
