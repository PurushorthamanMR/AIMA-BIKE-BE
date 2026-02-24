const { Op } = require('sequelize');
const { Transfer, Stock, User, Model, Category } = require('../models');
const { sequelize } = require('../config/database');
const stockService = require('./stockService');
const logger = require('../config/logger');

const defaultInclude = [
  { model: Stock, as: 'stock', include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }] },
  { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'isActive'] }
];

class TransferService {
  async save(dto) {
    logger.info('TransferService.save() invoked');

    const transaction = await sequelize.transaction();
    try {
      const transfer = await Transfer.create(
        {
          stockId: dto.stockId ?? dto.stock?.id,
          userId: dto.userId ?? dto.user?.id,
          quantity: dto.quantity ?? null,
          companyName: dto.companyName,
          contactNumber: dto.contactNumber ?? null,
          address: dto.address,
          deliveryDetails: dto.deliveryDetails,
          nic: dto.nic ?? null,
          isActive: dto.isActive !== undefined ? dto.isActive : true
        },
        { transaction }
      );

      const qty = transfer.quantity ?? 0;
      if (qty > 0) {
        await stockService.reduceQuantityByStockId(transfer.stockId, qty, { transaction });
      }

      await transaction.commit();

      const withAssoc = await Transfer.findByPk(transfer.id, { include: defaultInclude });
      return this.transformToDto(withAssoc);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(dto) {
    logger.info('TransferService.update() invoked');

    const transfer = await Transfer.findByPk(dto.id);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    const updateData = {
      companyName: dto.companyName ?? transfer.companyName,
      address: dto.address ?? transfer.address,
      deliveryDetails: dto.deliveryDetails ?? transfer.deliveryDetails,
      isActive: dto.isActive !== undefined ? dto.isActive : transfer.isActive
    };
    if (dto.stockId != null) updateData.stockId = dto.stockId;
    if (dto.userId != null) updateData.userId = dto.userId;
    if (dto.quantity !== undefined) updateData.quantity = dto.quantity;
    if (dto.contactNumber !== undefined) updateData.contactNumber = dto.contactNumber;
    if (dto.nic !== undefined) updateData.nic = dto.nic;

    await transfer.update(updateData);

    const updated = await Transfer.findByPk(transfer.id, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async updateStatus(transferId, status) {
    logger.info('TransferService.updateStatus() invoked');

    const transfer = await Transfer.findByPk(transferId);
    if (!transfer) {
      return null;
    }

    await transfer.update({ isActive: status });

    const updated = await Transfer.findByPk(transferId, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async getByStockId(stockId) {
    logger.info('TransferService.getByStockId() invoked');

    const where = {};
    if (stockId != null && !Number.isNaN(Number(stockId))) where.stockId = Number(stockId);

    const list = await Transfer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(t => this.transformToDto(t));
  }

  async getByCompanyName(companyName) {
    logger.info('TransferService.getByCompanyName() invoked');

    const where = {};
    if (companyName) {
      where.companyName = { [Op.like]: `%${companyName}%` };
    }

    const list = await Transfer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(t => this.transformToDto(t));
  }

  async getByUserId(userId) {
    logger.info('TransferService.getByUserId() invoked');

    const where = {};
    if (userId != null && !Number.isNaN(Number(userId))) where.userId = Number(userId);

    const list = await Transfer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(t => this.transformToDto(t));
  }

  /**
   * Get by receiver name (searches companyName).
   */
  async getByReceiverName(receiverName) {
    logger.info('TransferService.getByReceiverName() invoked');

    const where = {};
    if (receiverName) {
      where.companyName = { [Op.like]: `%${receiverName}%` };
    }

    const list = await Transfer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(t => this.transformToDto(t));
  }

  transformToDto(transfer) {
    if (!transfer) return null;
    return {
      id: transfer.id,
      stockId: transfer.stockId,
      userId: transfer.userId,
      quantity: transfer.quantity,
      companyName: transfer.companyName,
      contactNumber: transfer.contactNumber,
      address: transfer.address,
      deliveryDetails: transfer.deliveryDetails,
      nic: transfer.nic,
      isActive: transfer.isActive,
      stockDto: transfer.stock
        ? {
            id: transfer.stock.id,
            modelId: transfer.stock.modelId,
            name: transfer.stock.name,
            itemCode: transfer.stock.itemCode,
            color: transfer.stock.color,
            quantity: transfer.stock.quantity,
            modelDto: transfer.stock.model
              ? {
                  id: transfer.stock.model.id,
                  name: transfer.stock.model.name,
                  categoryDto: transfer.stock.model.category
                    ? { id: transfer.stock.model.category.id, name: transfer.stock.model.category.name }
                    : null
                }
              : null
          }
        : null,
      userDto: transfer.user
        ? {
            id: transfer.user.id,
            firstName: transfer.user.firstName,
            lastName: transfer.user.lastName,
            emailAddress: transfer.user.emailAddress,
            isActive: transfer.user.isActive
          }
        : null
    };
  }
}

module.exports = new TransferService();
