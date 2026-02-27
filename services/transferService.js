const { Op } = require('sequelize');
const { Transfer, TransferList, Stock, User, Model, Category } = require('../models');
const { sequelize } = require('../config/database');
const stockService = require('./stockService');
const logger = require('../config/logger');

/** Contact number must be exactly 10 digits when provided. */
function validateContactNumber(value) {
  if (value == null || value === '') return;
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) throw new Error('Contact number must be 10 digits only.');
  const str = String(num);
  if (str.length !== 10) throw new Error('Contact number must be exactly 10 digits.');
}

/** Sri Lanka NIC: old (9 digits + V/X) or new (12 digits) only. */
function validateNIC(value) {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return;
  const n = String(value).trim().replace(/[\s-]/g, '');
  if (!n) return;
  const oldFormat = /^\d{9}[VvXx]$/;
  const newFormat = /^\d{12}$/;
  if (!oldFormat.test(n) && !newFormat.test(n)) {
    throw new Error('NIC must be Sri Lanka format: old (9 digits + V or X) or new (12 digits only).');
  }
}

const stockInclude = [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }];
const defaultInclude = [
  {
    model: TransferList,
    as: 'transferList',
    include: [{ model: Stock, as: 'stock', include: stockInclude }]
  },
  { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'isActive'] }
];

class TransferService {
  async save(dto) {
    logger.info('TransferService.save() invoked');

    const rawItems = dto.transferList ?? dto.items ?? (dto.stockId != null ? [{ stockId: dto.stockId ?? dto.stock?.id, quantity: dto.quantity ?? 1 }] : []);
    if (!rawItems.length) {
      throw new Error('At least one stock item is required in transferList');
    }

    // Merge by stockId: same stockId appears once with summed quantity (duplicate stockIds not saved as separate lines)
    const byStockId = {};
    for (const line of rawItems) {
      const stockId = line.stockId ?? line.stock?.id;
      if (!stockId) continue;
      const sid = Number(stockId);
      byStockId[sid] = (byStockId[sid] || 0) + (line.quantity ?? 1);
    }
    const items = Object.entries(byStockId).map(([stockId, quantity]) => ({ stockId: Number(stockId), quantity }));

    validateContactNumber(dto.contactNumber);
    validateNIC(dto.nic);

    const transaction = await sequelize.transaction();
    try {
      const transfer = await Transfer.create(
        {
          userId: dto.userId ?? dto.user?.id,
          companyName: dto.companyName,
          contactNumber: dto.contactNumber ?? null,
          address: dto.address,
          deliveryDetails: dto.deliveryDetails,
          nic: dto.nic ?? null,
          isActive: dto.isActive !== undefined ? dto.isActive : true
        },
        { transaction }
      );

      for (const line of items) {
        const stockId = line.stockId ?? line.stock?.id;
        const quantity = line.quantity ?? 1; // default 1, aligns with stock.quantity
        if (!stockId) continue;
        await TransferList.create(
          { transferId: transfer.id, stockId, quantity },
          { transaction }
        );
        if (quantity > 0) {
          await stockService.reduceQuantityByStockId(stockId, quantity, { transaction });
        }
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

    validateContactNumber(dto.contactNumber);
    validateNIC(dto.nic);

    const updateData = {
      companyName: dto.companyName ?? transfer.companyName,
      address: dto.address ?? transfer.address,
      deliveryDetails: dto.deliveryDetails ?? transfer.deliveryDetails,
      isActive: dto.isActive !== undefined ? dto.isActive : transfer.isActive
    };
    if (dto.userId != null) updateData.userId = dto.userId;
    if (dto.contactNumber !== undefined) updateData.contactNumber = dto.contactNumber;
    if (dto.nic !== undefined) updateData.nic = dto.nic ?? null;

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

    if (stockId == null || Number.isNaN(Number(stockId))) {
      const list = await Transfer.findAll({ include: defaultInclude, order: [['id', 'ASC']] });
      return list.map(t => this.transformToDto(t));
    }
    const sid = Number(stockId);
    const list = await Transfer.findAll({
      include: [
        {
          model: TransferList,
          as: 'transferList',
          include: [{ model: Stock, as: 'stock', include: stockInclude }],
          where: { stockId: sid },
          required: true
        },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'isActive'] }
      ],
      order: [['id', 'ASC']]
    });
    // Re-fetch with full transferList so DTO has all lines
    const fullList = await Promise.all(list.map(t => Transfer.findByPk(t.id, { include: defaultInclude })));
    return fullList.filter(Boolean).map(t => this.transformToDto(t));
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

  async getByNic(nic) {
    logger.info('TransferService.getByNic() invoked');

    const where = {};
    if (nic) {
      where.nic = { [Op.like]: `%${nic}%` };
    }

    const list = await Transfer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(t => this.transformToDto(t));
  }

  /**
   * Get transfers with pagination.
   * GET /transfer/getAllPage?pageNumber=1&pageSize=10&isActive=true&companyName=...
   */
  async getAllPage(pageNumber = 1, pageSize = 10, isActive, searchParams) {
    logger.info('TransferService.getAllPage() invoked');

    const where = {};
    if (isActive !== undefined && isActive !== null && isActive !== '') where.isActive = isActive === true || isActive === 'true';
    if (searchParams?.companyName) where.companyName = { [Op.like]: `%${searchParams.companyName}%` };
    if (searchParams?.nic) where.nic = { [Op.like]: `%${searchParams.nic}%` };

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Transfer.findAndCountAll({
      where,
      include: defaultInclude,
      limit: pageSize,
      offset,
      order: [['id', 'DESC']]
    });

    const content = rows.map(t => this.transformToDto(t));
    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
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
   * Get transfer by ID with transferList (and stock, user).
   * GET /transfer/getById?id=1
   */
  async getById(id) {
    logger.info('TransferService.getById() invoked');
    const transfer = await Transfer.findByPk(id, { include: defaultInclude });
    return transfer ? this.transformToDto(transfer) : null;
  }

  transformToDto(transfer) {
    if (!transfer) return null;
    const transferList = (transfer.transferList || []).map(line => ({
      id: line.id,
      transferId: line.transferId,
      stockId: line.stockId,
      quantity: line.quantity,
      stockDto: line.stock
        ? {
            id: line.stock.id,
            modelId: line.stock.modelId,
            name: line.stock.name,
            itemCode: line.stock.itemCode,
            color: line.stock.color,
            quantity: line.stock.quantity,
            modelDto: line.stock.model
              ? {
                  id: line.stock.model.id,
                  name: line.stock.model.name,
                  categoryDto: line.stock.model.category
                    ? { id: line.stock.model.category.id, name: line.stock.model.category.name }
                    : null
                }
              : null
          }
        : null
    }));
    return {
      id: transfer.id,
      userId: transfer.userId,
      companyName: transfer.companyName,
      contactNumber: transfer.contactNumber,
      address: transfer.address,
      deliveryDetails: transfer.deliveryDetails,
      nic: transfer.nic ?? null,
      isActive: transfer.isActive,
      transferList,
      userDto: transfer.user
        ? {
            id: transfer.user.id,
            firstName: transfer.user.firstName,
            lastName: transfer.user.lastName,
            name: [transfer.user.firstName, transfer.user.lastName].filter(Boolean).join(' ') || null,
            emailAddress: transfer.user.emailAddress,
            isActive: transfer.user.isActive
          }
        : null
    };
  }
}

module.exports = new TransferService();
