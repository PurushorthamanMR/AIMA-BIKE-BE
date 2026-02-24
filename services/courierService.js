const { Op } = require('sequelize');
const { Courier, Category, Customer, Model, Payment } = require('../models');
const logger = require('../config/logger');

const defaultInclude = [
  { model: Category, as: 'category' },
  { model: Customer, as: 'customer', include: [{ model: Model, as: 'model' }, { model: Payment, as: 'payment' }] }
];

class CourierService {
  /**
   * Save courier (sent only): categoryId, customerId, name, contactNumber, address, sentDate.
   * receivedDate, receivername, nic are set later via /courier/received.
   */
  async save(dto) {
    logger.info('CourierService.save() invoked');

    const courier = await Courier.create({
      categoryId: dto.categoryId ?? dto.category?.id,
      customerId: dto.customerId ?? dto.customer?.id,
      name: dto.name,
      contactNumber: dto.contactNumber ?? null,
      address: dto.address,
      sentDate: dto.sentDate ?? null,
      isActive: dto.isActive !== undefined ? dto.isActive : true
    });

    const withAssoc = await Courier.findByPk(courier.id, { include: defaultInclude });
    return this.transformToDto(withAssoc);
  }

  /**
   * Mark courier as received: update only receivedDate, receivername, nic.
   * POST body: { courierId (or id), receivedDate, receivername, nic }
   */
  async received(dto) {
    logger.info('CourierService.received() invoked');

    const courierId = dto.courierId ?? dto.id;
    const courier = await Courier.findByPk(courierId);
    if (!courier) {
      return null;
    }

    await courier.update({
      receivedDate: dto.receivedDate ?? courier.receivedDate,
      receivername: dto.receivername ?? dto.receiverName ?? courier.receivername,
      nic: dto.nic ?? courier.nic
    });

    const updated = await Courier.findByPk(courier.id, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async update(dto) {
    logger.info('CourierService.update() invoked');

    const courier = await Courier.findByPk(dto.id);
    if (!courier) {
      throw new Error('Courier not found');
    }

    const updateData = {
      name: dto.name ?? courier.name,
      address: dto.address ?? courier.address,
      receivername: dto.receivername ?? courier.receivername,
      nic: dto.nic ?? courier.nic,
      isActive: dto.isActive !== undefined ? dto.isActive : courier.isActive
    };
    if (dto.categoryId != null) updateData.categoryId = dto.categoryId;
    if (dto.customerId != null) updateData.customerId = dto.customerId;
    if (dto.contactNumber !== undefined) updateData.contactNumber = dto.contactNumber;
    if (dto.sentDate !== undefined) updateData.sentDate = dto.sentDate;
    if (dto.receivedDate !== undefined) updateData.receivedDate = dto.receivedDate;

    await courier.update(updateData);

    const updated = await Courier.findByPk(courier.id, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async updateStatus(courierId, status) {
    logger.info('CourierService.updateStatus() invoked');

    const courier = await Courier.findByPk(courierId);
    if (!courier) {
      return null;
    }

    await courier.update({ isActive: status });

    const updated = await Courier.findByPk(courierId, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async getById(id) {
    logger.info('CourierService.getById() invoked');
    const courier = await Courier.findByPk(id, { include: defaultInclude });
    return courier ? this.transformToDto(courier) : null;
  }

  async getByCategoryId(categoryId) {
    logger.info('CourierService.getByCategoryId() invoked');

    const where = {};
    if (categoryId != null && !Number.isNaN(Number(categoryId))) where.categoryId = Number(categoryId);

    const list = await Courier.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByCustomerId(customerId) {
    logger.info('CourierService.getByCustomerId() invoked');

    const where = {};
    if (customerId != null && !Number.isNaN(Number(customerId))) where.customerId = Number(customerId);

    const list = await Courier.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByName(name) {
    logger.info('CourierService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const list = await Courier.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByReceiverName(receivername) {
    logger.info('CourierService.getByReceiverName() invoked');

    const where = {};
    if (receivername) {
      where.receivername = { [Op.like]: `%${receivername}%` };
    }

    const list = await Courier.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  transformToDto(courier) {
    if (!courier) return null;
    return {
      id: courier.id,
      categoryId: courier.categoryId,
      customerId: courier.customerId,
      name: courier.name,
      contactNumber: courier.contactNumber,
      address: courier.address,
      sentDate: courier.sentDate,
      receivedDate: courier.receivedDate,
      receivername: courier.receivername,
      nic: courier.nic,
      isActive: courier.isActive,
      categoryDto: courier.category ? { id: courier.category.id, name: courier.category.name, isActive: courier.category.isActive } : null,
      customerDto: courier.customer
        ? {
            id: courier.customer.id,
            name: courier.customer.name,
            address: courier.customer.address,
            modelId: courier.customer.modelId,
            paymentId: courier.customer.paymentId,
            isActive: courier.customer.isActive,
            status: courier.customer.status,
            modelDto: courier.customer.model || null,
            paymentDto: courier.customer.payment || null
          }
        : null
    };
  }
}

module.exports = new CourierService();
