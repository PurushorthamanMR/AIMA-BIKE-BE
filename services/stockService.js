const { Op } = require('sequelize');
const { Stock, Model, Category } = require('../models');
const logger = require('../config/logger');

const defaultInclude = [{ model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }];

class StockService {
  async save(stockDto) {
    logger.info('StockService.save() invoked');

    const noteId = stockDto.noteId ?? stockDto.note?.id;
    if (noteId == null) {
      throw new Error('noteId is required to save stock. Use POST /dealerConsignmentNote/save to create stock (note + items).');
    }
    const stock = await Stock.create({
      noteId,
      modelId: stockDto.modelId ?? stockDto.model?.id,
      itemCode: stockDto.itemCode ?? null,
      chassisNumber: stockDto.chassisNumber ?? null,
      motorNumber: stockDto.motorNumber ?? null,
      color: stockDto.color ?? null,
      quantity: stockDto.quantity ?? 1
    });

    const withModel = await Stock.findByPk(stock.id, { include: defaultInclude });
    return this.transformToDto(withModel);
  }

  async getAllPage(pageNumber, pageSize, searchParams) {
    logger.info('StockService.getAllPage() invoked');

    const where = {};
    if (searchParams?.noteId != null) where.noteId = searchParams.noteId;
    if (searchParams?.modelId != null) where.modelId = searchParams.modelId;
    if (searchParams?.color) where.color = { [Op.like]: `%${searchParams.color}%` };
    if (searchParams?.itemCode) where.itemCode = { [Op.like]: `%${searchParams.itemCode}%` };

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Stock.findAndCountAll({
      where,
      include: defaultInclude,
      limit: pageSize,
      offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map((s) => this.transformToDto(s));
    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByNoteId(noteId) {
    logger.info('StockService.getByNoteId() invoked');

    const stocks = await Stock.findAll({
      where: { noteId },
      include: defaultInclude,
      order: [['id', 'ASC']]
    });
    return stocks.map((s) => this.transformToDto(s));
  }

  async getByName(name) {
    logger.info('StockService.getByName() invoked');
    const where = name ? { itemCode: { [Op.like]: `%${name}%` } } : {};
    const stocks = await Stock.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });
    return stocks.map((s) => this.transformToDto(s));
  }

  async getByColor(color) {
    logger.info('StockService.getByColor() invoked');
    const where = color ? { color: { [Op.like]: `%${color}%` } } : {};
    const stocks = await Stock.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });
    return stocks.map((s) => this.transformToDto(s));
  }

  async getByModel(modelId) {
    logger.info('StockService.getByModel() invoked');
    const stocks = await Stock.findAll({
      where: { modelId },
      include: defaultInclude,
      order: [['id', 'ASC']]
    });
    return stocks.map((s) => this.transformToDto(s));
  }

  async update(stockDto) {
    logger.info('StockService.update() invoked');

    const stock = await Stock.findByPk(stockDto.id);
    if (!stock) {
      throw new Error('Stock not found');
    }

    const updateData = {};
    if (stockDto.noteId != null) updateData.noteId = stockDto.noteId;
    if (stockDto.modelId != null) updateData.modelId = stockDto.modelId;
    if (stockDto.itemCode !== undefined) updateData.itemCode = stockDto.itemCode;
    if (stockDto.chassisNumber !== undefined) updateData.chassisNumber = stockDto.chassisNumber;
    if (stockDto.motorNumber !== undefined) updateData.motorNumber = stockDto.motorNumber;
    if (stockDto.color !== undefined) updateData.color = stockDto.color;
    if (stockDto.quantity !== undefined) updateData.quantity = stockDto.quantity;

    await stock.update(updateData);

    const updated = await Stock.findByPk(stock.id, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async updateQuantity(stockId, quantityToAdd) {
    logger.info('StockService.updateQuantity() invoked');

    const stock = await Stock.findByPk(stockId);
    if (!stock) return null;

    const currentQuantity = stock.quantity ?? 0;
    const newQuantity = currentQuantity + quantityToAdd;
    await stock.update({ quantity: newQuantity });

    const updated = await Stock.findByPk(stockId, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async reduceQuantityByModel(modelId, quantityToReduce, options = {}) {
    const where = { modelId };
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

  async reduceQuantityByStockId(stockId, quantityToReduce, options = {}) {
    if (quantityToReduce == null || quantityToReduce <= 0) return null;

    const findOpts = {};
    if (options.transaction) findOpts.transaction = options.transaction;

    const stock = await Stock.findByPk(stockId, findOpts);
    if (!stock) throw new Error(`Stock with id ${stockId} not found`);

    const current = stock.quantity ?? 0;
    if (current < quantityToReduce) {
      throw new Error(`Insufficient stock: required ${quantityToReduce}, available ${current} (stockId ${stockId})`);
    }

    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await stock.update({ quantity: current - quantityToReduce }, updateOpts);
    return stock;
  }

  async addQuantityByModel(modelId, quantityToAdd, options = {}) {
    const where = { modelId };
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
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await stock.update({ quantity: current + quantityToAdd }, updateOpts);
    return stock;
  }

  async addQuantityByStockId(stockId, quantityToAdd, options = {}) {
    if (quantityToAdd == null || quantityToAdd <= 0) return null;

    const findOpts = {};
    if (options.transaction) findOpts.transaction = options.transaction;

    const stock = await Stock.findByPk(stockId, findOpts);
    if (!stock) throw new Error(`Stock with id ${stockId} not found`);

    const current = stock.quantity ?? 0;
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;
    await stock.update({ quantity: current + quantityToAdd }, updateOpts);
    return stock;
  }

  transformToDto(stock) {
    if (!stock) return null;
    return {
      id: stock.id,
      noteId: stock.noteId,
      modelId: stock.modelId,
      itemCode: stock.itemCode,
      chassisNumber: stock.chassisNumber,
      motorNumber: stock.motorNumber,
      color: stock.color,
      quantity: stock.quantity,
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
