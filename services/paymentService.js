const { Op } = require('sequelize');
const { Payment } = require('../models');
const logger = require('../config/logger');

class PaymentService {
  async save(paymentDto) {
    logger.info('PaymentService.save() invoked');

    const payment = await Payment.create({
      name: paymentDto.name ?? null,
      isActive: paymentDto.isActive !== undefined ? paymentDto.isActive : true
    });

    return this.transformToDto(payment);
  }

  async getByName(name) {
    logger.info('PaymentService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const payments = await Payment.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return payments.map(p => this.transformToDto(p));
  }

  async update(paymentDto) {
    logger.info('PaymentService.update() invoked');

    const payment = await Payment.findByPk(paymentDto.id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    await payment.update({
      name: paymentDto.name !== undefined ? paymentDto.name : payment.name,
      isActive: paymentDto.isActive !== undefined ? paymentDto.isActive : payment.isActive
    });

    return this.transformToDto(payment);
  }

  async updateStatus(paymentId, status) {
    logger.info('PaymentService.updateStatus() invoked');

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return null;
    }

    await payment.update({ isActive: status });
    return this.transformToDto(payment);
  }

  transformToDto(payment) {
    if (!payment) return null;
    return {
      id: payment.id,
      name: payment.name,
      isActive: payment.isActive
    };
  }
}

module.exports = new PaymentService();
