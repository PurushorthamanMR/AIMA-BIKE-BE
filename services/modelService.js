const { Op } = require('sequelize');
const { Model, Category } = require('../models');
const logger = require('../config/logger');

class ModelService {
  async save(modelDto) {
    logger.info('ModelService.save() invoked');

    const model = await Model.create({
      categoryId: modelDto.categoryId ?? modelDto.category?.id,
      name: modelDto.name,
      imageUrl: modelDto.imageUrl ?? null,
      isActive: modelDto.isActive !== undefined ? modelDto.isActive : true
    });

    const withCategory = await Model.findByPk(model.id, {
      include: [{ model: Category, as: 'category' }]
    });
    return this.transformToDto(withCategory);
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('ModelService.getAllPage() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams?.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }
    if (searchParams?.categoryId != null) {
      where.categoryId = searchParams.categoryId;
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Model.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      limit: pageSize,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map(m => this.transformToDto(m));

    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByName(name) {
    logger.info('ModelService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const models = await Model.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['id', 'ASC']]
    });

    return models.map(m => this.transformToDto(m));
  }

  async getByCategory(categoryId) {
    logger.info('ModelService.getByCategory() invoked');

    const models = await Model.findAll({
      where: { categoryId, isActive: true },
      include: [{ model: Category, as: 'category' }],
      order: [['id', 'ASC']]
    });

    return models.map(m => this.transformToDto(m));
  }

  async update(modelDto) {
    logger.info('ModelService.update() invoked');

    const model = await Model.findByPk(modelDto.id);
    if (!model) {
      throw new Error('Model not found');
    }

    const updateData = {
      name: modelDto.name,
      isActive: modelDto.isActive !== undefined ? modelDto.isActive : model.isActive
    };
    if (modelDto.categoryId != null) updateData.categoryId = modelDto.categoryId;
    if (modelDto.imageUrl !== undefined) updateData.imageUrl = modelDto.imageUrl;

    await model.update(updateData);

    const updated = await Model.findByPk(model.id, {
      include: [{ model: Category, as: 'category' }]
    });
    return this.transformToDto(updated);
  }

  async updateStatus(modelId, status) {
    logger.info('ModelService.updateStatus() invoked');

    const model = await Model.findByPk(modelId);
    if (!model) {
      return null;
    }

    await model.update({ isActive: status });

    const updated = await Model.findByPk(modelId, {
      include: [{ model: Category, as: 'category' }]
    });
    return this.transformToDto(updated);
  }

  transformToDto(model) {
    if (!model) return null;
    return {
      id: model.id,
      categoryId: model.categoryId,
      name: model.name,
      imageUrl: model.imageUrl,
      isActive: model.isActive,
      categoryDto: model.category
        ? { id: model.category.id, name: model.category.name, isActive: model.category.isActive }
        : null
    };
  }
}

module.exports = new ModelService();
