const { Op } = require('sequelize');
const { Setting } = require('../models');
const logger = require('../config/logger');

class SettingsService {
  async save(dto) {
    logger.info('SettingsService.save() invoked');

    const setting = await Setting.create({
      name: dto.name,
      isActiveAdmin: dto.isActiveAdmin !== undefined ? dto.isActiveAdmin : true,
      isActiveManager: dto.isActiveManager !== undefined ? dto.isActiveManager : true
    });

    return this.transformToDto(setting);
  }

  async update(dto) {
    logger.info('SettingsService.update() invoked');

    const setting = await Setting.findByPk(dto.id);
    if (!setting) {
      throw new Error('Setting not found');
    }

    await setting.update({
      name: dto.name !== undefined ? dto.name : setting.name,
      isActiveAdmin: dto.isActiveAdmin !== undefined ? dto.isActiveAdmin : setting.isActiveAdmin,
      isActiveManager: dto.isActiveManager !== undefined ? dto.isActiveManager : setting.isActiveManager
    });

    return this.transformToDto(setting);
  }

  async updateAdminStatus(id, status) {
    logger.info('SettingsService.updateAdminStatus() invoked');

    const setting = await Setting.findByPk(id);
    if (!setting) {
      return null;
    }

    await setting.update({ isActiveAdmin: status });
    return this.transformToDto(setting);
  }

  async updateManagerStatus(id, status) {
    logger.info('SettingsService.updateManagerStatus() invoked');

    const setting = await Setting.findByPk(id);
    if (!setting) {
      return null;
    }

    await setting.update({ isActiveManager: status });
    return this.transformToDto(setting);
  }

  async getByName(name) {
    logger.info('SettingsService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const list = await Setting.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return list.map(s => this.transformToDto(s));
  }

  async getAllPagination(pageNumber = 1, pageSize = 10, searchParams = {}) {
    logger.info('SettingsService.getAllPagination() invoked');

    const where = {};
    if (searchParams.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }
    if (searchParams.isActiveAdmin !== undefined && searchParams.isActiveAdmin !== null && searchParams.isActiveAdmin !== '') {
      where.isActiveAdmin = searchParams.isActiveAdmin === true || searchParams.isActiveAdmin === 'true';
    }
    if (searchParams.isActiveManager !== undefined && searchParams.isActiveManager !== null && searchParams.isActiveManager !== '') {
      where.isActiveManager = searchParams.isActiveManager === true || searchParams.isActiveManager === 'true';
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Setting.findAndCountAll({
      where,
      limit: pageSize,
      offset,
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

  transformToDto(setting) {
    if (!setting) return null;
    return {
      id: setting.id,
      name: setting.name,
      isActiveAdmin: setting.isActiveAdmin,
      isActiveManager: setting.isActiveManager
    };
  }
}

module.exports = new SettingsService();
