const { Cash } = require('../models');
const logger = require('../config/logger');

class CashService {
  async save(cashDto) {
    logger.info('CashService.save() invoked');

    const cash = await Cash.create({
      customerId: cashDto.customerId ?? cashDto.customer?.id,
      copyOfNic: cashDto.copyOfNic ?? null,
      photographOne: cashDto.photographOne ?? null,
      photographTwo: cashDto.photographTwo ?? null,
      paymentReceipt: cashDto.paymentReceipt ?? null,
      mta2: cashDto.mta2 ?? null,
      slip: cashDto.slip ?? null,
      chequeNumber: cashDto.chequeNumber ?? null,
      isActive: cashDto.isActive !== undefined ? cashDto.isActive : true
    });

    return this.transformToDto(cash);
  }

  async saveWithTransaction(cashDto, transaction) {
    const cash = await Cash.create(
      {
        customerId: cashDto.customerId ?? cashDto.customer?.id,
        copyOfNic: cashDto.copyOfNic ?? null,
        photographOne: cashDto.photographOne ?? null,
        photographTwo: cashDto.photographTwo ?? null,
        paymentReceipt: cashDto.paymentReceipt ?? null,
        mta2: cashDto.mta2 ?? null,
        slip: cashDto.slip ?? null,
        chequeNumber: cashDto.chequeNumber ?? null,
        isActive: cashDto.isActive !== undefined ? cashDto.isActive : true
      },
      { transaction }
    );
    return this.transformToDto(cash);
  }

  async update(cashDto) {
    logger.info('CashService.update() invoked');

    const cash = await Cash.findByPk(cashDto.id);
    if (!cash) {
      throw new Error('Cash not found');
    }

    const updateData = {
      isActive: cashDto.isActive !== undefined ? cashDto.isActive : cash.isActive
    };
    if (cashDto.customerId != null) updateData.customerId = cashDto.customerId;
    if (cashDto.copyOfNic !== undefined) updateData.copyOfNic = cashDto.copyOfNic;
    if (cashDto.photographOne !== undefined) updateData.photographOne = cashDto.photographOne;
    if (cashDto.photographTwo !== undefined) updateData.photographTwo = cashDto.photographTwo;
    if (cashDto.paymentReceipt !== undefined) updateData.paymentReceipt = cashDto.paymentReceipt;
    if (cashDto.mta2 !== undefined) updateData.mta2 = cashDto.mta2;
    if (cashDto.slip !== undefined) updateData.slip = cashDto.slip;
    if (cashDto.chequeNumber !== undefined) updateData.chequeNumber = cashDto.chequeNumber;

    await cash.update(updateData);
    return this.transformToDto(cash);
  }

  async updateStatus(cashId, status) {
    logger.info('CashService.updateStatus() invoked');

    const cash = await Cash.findByPk(cashId);
    if (!cash) {
      return null;
    }

    await cash.update({ isActive: status });
    return this.transformToDto(cash);
  }

  async getByCustomer(customerId) {
    logger.info('CashService.getByCustomer() invoked');

    const list = await Cash.findAll({
      where: { customerId },
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  transformToDto(cash) {
    if (!cash) return null;
    return {
      id: cash.id,
      customerId: cash.customerId,
      copyOfNic: cash.copyOfNic,
      photographOne: cash.photographOne,
      photographTwo: cash.photographTwo,
      paymentReceipt: cash.paymentReceipt,
      mta2: cash.mta2,
      slip: cash.slip,
      chequeNumber: cash.chequeNumber,
      isActive: cash.isActive
    };
  }
}

module.exports = new CashService();
