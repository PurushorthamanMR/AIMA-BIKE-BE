const { ShopDetail } = require('../models');
const logger = require('../config/logger');

class ShopDetailsService {
  async save(dto) {
    logger.info('ShopDetailsService.save() invoked');

    const shop = await ShopDetail.create({
      name: dto.name,
      logo: dto.logo ?? null,
      address: dto.address ?? null,
      phoneNumber: dto.phoneNumber ?? null,
      isActive: dto.isActive !== undefined ? dto.isActive : true
    });

    return this.transformToDto(shop);
  }

  async getAll() {
    logger.info('ShopDetailsService.getAll() invoked');

    const list = await ShopDetail.findAll({
      order: [['id', 'ASC']]
    });

    return list.map(s => this.transformToDto(s));
  }

  async update(dto) {
    logger.info('ShopDetailsService.update() invoked');

    const shop = await ShopDetail.findByPk(dto.id);
    if (!shop) {
      throw new Error('Shop detail not found');
    }

    await shop.update({
      name: dto.name ?? shop.name,
      logo: dto.logo !== undefined ? dto.logo : shop.logo,
      address: dto.address !== undefined ? dto.address : shop.address,
      phoneNumber: dto.phoneNumber !== undefined ? dto.phoneNumber : shop.phoneNumber,
      isActive: dto.isActive !== undefined ? dto.isActive : shop.isActive
    });

    return this.transformToDto(shop);
  }

  async updateStatus(shopId, status) {
    logger.info('ShopDetailsService.updateStatus() invoked');

    const shop = await ShopDetail.findByPk(shopId);
    if (!shop) {
      return null;
    }

    await shop.update({ isActive: status });
    return this.transformToDto(shop);
  }

  transformToDto(shop) {
    if (!shop) return null;
    return {
      id: shop.id,
      name: shop.name,
      logo: shop.logo,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      isActive: shop.isActive
    };
  }
}

module.exports = new ShopDetailsService();
