const { Op } = require('sequelize');
const { Lease } = require('../models');
const logger = require('../config/logger');

class LeaseService {
  async save(leaseDto) {
    logger.info('LeaseService.save() invoked');

    const lease = await Lease.create({
      customerId: leaseDto.customerId ?? leaseDto.customer?.id,
      companyName: leaseDto.companyName ?? null,
      purchaseOrderNumber: leaseDto.purchaseOrderNumber ?? null,
      copyOfNic: leaseDto.copyOfNic ?? null,
      photographOne: leaseDto.photographOne ?? null,
      photographTwo: leaseDto.photographTwo ?? null,
      paymentReceipt: leaseDto.paymentReceipt ?? null,
      mta2: leaseDto.mta2 ?? null,
      mta3: leaseDto.mta3 ?? null,
      chequeNumber: leaseDto.chequeNumber ?? null,
      isActive: leaseDto.isActive !== undefined ? leaseDto.isActive : true
    });

    return this.transformToDto(lease);
  }

  async saveWithTransaction(leaseDto, transaction) {
    const lease = await Lease.create(
      {
        customerId: leaseDto.customerId ?? leaseDto.customer?.id,
        companyName: leaseDto.companyName ?? null,
        purchaseOrderNumber: leaseDto.purchaseOrderNumber ?? null,
        copyOfNic: leaseDto.copyOfNic ?? null,
        photographOne: leaseDto.photographOne ?? null,
        photographTwo: leaseDto.photographTwo ?? null,
        paymentReceipt: leaseDto.paymentReceipt ?? null,
        mta2: leaseDto.mta2 ?? null,
        mta3: leaseDto.mta3 ?? null,
        chequeNumber: leaseDto.chequeNumber ?? null,
        isActive: leaseDto.isActive !== undefined ? leaseDto.isActive : true
      },
      { transaction }
    );
    return this.transformToDto(lease);
  }

  async update(leaseDto) {
    logger.info('LeaseService.update() invoked');

    const lease = await Lease.findByPk(leaseDto.id);
    if (!lease) {
      throw new Error('Lease not found');
    }

    const updateData = {
      isActive: leaseDto.isActive !== undefined ? leaseDto.isActive : lease.isActive
    };
    if (leaseDto.customerId != null) updateData.customerId = leaseDto.customerId;
    if (leaseDto.companyName !== undefined) updateData.companyName = leaseDto.companyName;
    if (leaseDto.purchaseOrderNumber !== undefined) updateData.purchaseOrderNumber = leaseDto.purchaseOrderNumber;
    if (leaseDto.copyOfNic !== undefined) updateData.copyOfNic = leaseDto.copyOfNic;
    if (leaseDto.photographOne !== undefined) updateData.photographOne = leaseDto.photographOne;
    if (leaseDto.photographTwo !== undefined) updateData.photographTwo = leaseDto.photographTwo;
    if (leaseDto.paymentReceipt !== undefined) updateData.paymentReceipt = leaseDto.paymentReceipt;
    if (leaseDto.mta2 !== undefined) updateData.mta2 = leaseDto.mta2;
    if (leaseDto.mta3 !== undefined) updateData.mta3 = leaseDto.mta3;
    if (leaseDto.chequeNumber !== undefined) updateData.chequeNumber = leaseDto.chequeNumber;

    await lease.update(updateData);
    return this.transformToDto(lease);
  }

  async updateStatus(leaseId, status) {
    logger.info('LeaseService.updateStatus() invoked');

    const lease = await Lease.findByPk(leaseId);
    if (!lease) {
      return null;
    }

    await lease.update({ isActive: status });
    return this.transformToDto(lease);
  }

  async getByCustomer(customerId) {
    logger.info('LeaseService.getByCustomer() invoked');

    const list = await Lease.findAll({
      where: { customerId },
      order: [['id', 'ASC']]
    });

    return list.map(l => this.transformToDto(l));
  }

  async getByCompany(companyName) {
    logger.info('LeaseService.getByCompany() invoked');

    const where = {};
    if (companyName) {
      where.companyName = { [Op.like]: `%${companyName}%` };
    }

    const list = await Lease.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return list.map(l => this.transformToDto(l));
  }

  transformToDto(lease) {
    if (!lease) return null;
    return {
      id: lease.id,
      customerId: lease.customerId,
      companyName: lease.companyName,
      purchaseOrderNumber: lease.purchaseOrderNumber,
      copyOfNic: lease.copyOfNic,
      photographOne: lease.photographOne,
      photographTwo: lease.photographTwo,
      paymentReceipt: lease.paymentReceipt,
      mta2: lease.mta2,
      mta3: lease.mta3,
      chequeNumber: lease.chequeNumber,
      isActive: lease.isActive
    };
  }
}

module.exports = new LeaseService();
