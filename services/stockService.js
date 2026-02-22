const { Op } = require('sequelize');
const { Stock, Model, Category } = require('../models');
const logger = require('../config/logger');

class StockService {
  async save(stockDto) {
    logger.info('StockService.save() invoked');

    const stock = await Stock.create({
      modelId: stockDto.modelId ?? stockDto.model?.id,
      name: stockDto.name,
      itemCode: stockDto.itemCode ?? null,
      color: stockDto.color,
      sellingAmount: stockDto.sellingAmount ?? null,
      quantity: stockDto.quantity ?? 0,
      imageUrl: stockDto.imageUrl ?? null,
      isActive: stockDto.isActive !== undefined ? stockDto.isActive : true
    });

    const withModel = await Stock.findByPk(stock.id, {
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }]
    });
    return this.transformToDto(withModel);
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('StockService.getAllPage() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams?.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }
    if (searchParams?.color) {
      where.color = { [Op.like]: `%${searchParams.color}%` };
    }
    if (searchParams?.modelId != null) {
      where.modelId = searchParams.modelId;
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Stock.findAndCountAll({
      where,
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }],
      limit: pageSize,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map(s => this.transformToDto(s));

    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByName(name) {
    logger.info('StockService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const stocks = await Stock.findAll({
      where,
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }],
      order: [['id', 'ASC']]
    });

    return stocks.map(s => this.transformToDto(s));
  }

  async getByColor(color) {
    logger.info('StockService.getByColor() invoked');

    const where = {};
    if (color) {
      where.color = { [Op.like]: `%${color}%` };
    }

    const stocks = await Stock.findAll({
      where,
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }],
      order: [['id', 'ASC']]
    });

    return stocks.map(s => this.transformToDto(s));
  }

  async getByModel(modelId) {
    logger.info('StockService.getByModel() invoked');

    const stocks = await Stock.findAll({
      where: { modelId, isActive: true },
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }],
      order: [['id', 'ASC']]
    });

    return stocks.map(s => this.transformToDto(s));
  }

  async update(stockDto) {
    logger.info('StockService.update() invoked');

    const stock = await Stock.findByPk(stockDto.id);
    if (!stock) {
      throw new Error('Stock not found');
    }

    const updateData = {
      name: stockDto.name,
      color: stockDto.color,
      isActive: stockDto.isActive !== undefined ? stockDto.isActive : stock.isActive
    };
    if (stockDto.modelId != null) updateData.modelId = stockDto.modelId;
    if (stockDto.itemCode !== undefined) updateData.itemCode = stockDto.itemCode;
    if (stockDto.sellingAmount !== undefined) updateData.sellingAmount = stockDto.sellingAmount;
    if (stockDto.quantity !== undefined) updateData.quantity = stockDto.quantity;
    if (stockDto.imageUrl !== undefined) updateData.imageUrl = stockDto.imageUrl;

    await stock.update(updateData);

    const updated = await Stock.findByPk(stock.id, {
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }]
    });
    return this.transformToDto(updated);
  }

  async updateStatus(stockId, status) {
    logger.info('StockService.updateStatus() invoked');

    const stock = await Stock.findByPk(stockId);
    if (!stock) {
      return null;
    }

    await stock.update({ isActive: status });

    const updated = await Stock.findByPk(stockId, {
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }]
    });
    return this.transformToDto(updated);
  }

  /**
   * Reduce stock quantity by model (and optional color/itemCode).
   * Used when saving dealer consignment note items or customer (sale).
   * @param {number} modelId - Model ID
   * @param {number} quantityToReduce - Quantity to deduct
   * @param {Object} options - { color?, itemCode?, transaction? }
   * @returns {Object} Updated stock row
   */
  async reduceQuantityByModel(modelId, quantityToReduce, options = {}) {
    const where = { modelId, isActive: true };
    if (options.color != null && options.color !== '') where.color = options.color;
    if (options.itemCode != null && options.itemCode !== '') where.itemCode = options.itemCode;

    const findOpts = { where, order: [['id', 'ASC']] };
    if (options.transaction) findOpts.transaction = options.transaction;

    const stocks = await Stock.findAll(findOpts);
    if (stocks.length === 0) {
      throw new Error(`No matching stock found for modelId ${modelId}${options.color ? ` and color ${options.color}` : ''}`);
    }

    const stock = stocks[0];
    const current = stock.quantity ?? 0;
    if (current < quantityToReduce) {
      throw new Error(`Insufficient stock: required ${quantityToReduce}, available ${current} (modelId ${modelId})`);
    }

    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await stock.update({ quantity: current - quantityToReduce }, updateOpts);
    return stock;
  }

  /**
   * Add quantity to current stock (e.g. current 50 + 50 => 100)
   */
  async updateQuantity(stockId, quantityToAdd) {
    logger.info('StockService.updateQuantity() invoked');

    const stock = await Stock.findByPk(stockId);
    if (!stock) {
      return null;
    }

    const currentQuantity = stock.quantity ?? 0;
    const newQuantity = currentQuantity + quantityToAdd;

    await stock.update({ quantity: newQuantity });

    const updated = await Stock.findByPk(stockId, {
      include: [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }]
    });
    return this.transformToDto(updated);
  }

  transformToDto(stock) {
    if (!stock) return null;
    return {
      id: stock.id,
      modelId: stock.modelId,
      name: stock.name,
      itemCode: stock.itemCode,
      color: stock.color,
      sellingAmount: stock.sellingAmount,
      quantity: stock.quantity,
      imageUrl: stock.imageUrl,
      isActive: stock.isActive,
      modelDto: stock.model
        ? {
            id: stock.model.id,
            categoryId: stock.model.categoryId,
            name: stock.model.name,
            imageUrl: stock.model.imageUrl,
            isActive: stock.model.isActive,
            categoryDto: stock.model.category
              ? { id: stock.model.category.id, name: stock.model.category.name, isActive: stock.model.category.isActive }
              : null
          }
        : null
    };
  }
}

module.exports = new StockService();
