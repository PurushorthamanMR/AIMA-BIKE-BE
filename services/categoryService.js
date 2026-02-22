const { Op } = require('sequelize');
const { Category } = require('../models');
const logger = require('../config/logger');

class CategoryService {
  async save(categoryDto) {
    logger.info('CategoryService.save() invoked');

    const category = await Category.create({
      name: categoryDto.name,
      isActive: categoryDto.isActive !== undefined ? categoryDto.isActive : true
    });

    return this.transformToDto(category);
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('CategoryService.getAllPage() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams?.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Category.findAndCountAll({
      where,
      limit: pageSize,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map(cat => this.transformToDto(cat));

    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByName(name) {
    logger.info('CategoryService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const categories = await Category.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return categories.map(cat => this.transformToDto(cat));
  }

  async update(categoryDto) {
    logger.info('CategoryService.update() invoked');

    const category = await Category.findByPk(categoryDto.id);
    if (!category) {
      throw new Error('Category not found');
    }

    await category.update({
      name: categoryDto.name,
      isActive: categoryDto.isActive !== undefined ? categoryDto.isActive : category.isActive
    });

    return this.transformToDto(category);
  }

  async updateStatus(categoryId, status) {
    logger.info('CategoryService.updateStatus() invoked');

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return null;
    }

    await category.update({ isActive: status });
    return this.transformToDto(category);
  }

  transformToDto(category) {
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive
    };
  }
}

module.exports = new CategoryService();
