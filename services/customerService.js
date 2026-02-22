const { Op } = require('sequelize');
const { Customer, Model, Category, Payment } = require('../models');
const logger = require('../config/logger');

const defaultInclude = [
  { model: Model, as: 'model', include: [{ model: Category, as: 'category' }] },
  { model: Payment, as: 'payment' }
];

class CustomerService {
  async save(customerDto) {
    logger.info('CustomerService.save() invoked');

    const customer = await Customer.create({
      name: customerDto.name,
      address: customerDto.address,
      province: customerDto.province,
      district: customerDto.district,
      occupation: customerDto.occupation,
      dateOfBirth: customerDto.dateOfBirth ?? null,
      religion: customerDto.religion,
      contactNumber: customerDto.contactNumber ?? null,
      whatsappNumber: customerDto.whatsappNumber ?? null,
      nic: customerDto.nic,
      modelId: customerDto.modelId ?? customerDto.model?.id,
      chassisNumber: customerDto.chassisNumber,
      motorNumber: customerDto.motorNumber,
      colorOfVehicle: customerDto.colorOfVehicle,
      dateOfPurchase: customerDto.dateOfPurchase ?? null,
      loyalityCardNo: customerDto.loyalityCardNo ?? null,
      dateOfDelivery: customerDto.dateOfDelivery ?? null,
      sellingAmount: customerDto.sellingAmount ?? null,
      registrationFees: customerDto.registrationFees ?? null,
      advancePaymentAmount: customerDto.advancePaymentAmount ?? null,
      advancePaymentDate: customerDto.advancePaymentDate ?? null,
      balancePaymentAmount: customerDto.balancePaymentAmount ?? null,
      balancePaymentDate: customerDto.balancePaymentDate ?? null,
      paymentId: customerDto.paymentId ?? customerDto.payment?.id,
      isActive: customerDto.isActive !== undefined ? customerDto.isActive : true
    });

    const withAssoc = await Customer.findByPk(customer.id, { include: defaultInclude });
    return this.transformToDto(withAssoc);
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('CustomerService.getAllPage() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams?.name) {
      where.name = { [Op.like]: `%${searchParams.name}%` };
    }
    if (searchParams?.colorOfVehicle) {
      where.colorOfVehicle = { [Op.like]: `%${searchParams.colorOfVehicle}%` };
    }
    if (searchParams?.modelId != null) {
      where.modelId = searchParams.modelId;
    }
    if (searchParams?.paymentId != null) {
      where.paymentId = searchParams.paymentId;
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Customer.findAndCountAll({
      where,
      include: defaultInclude,
      limit: pageSize,
      offset: offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map(c => this.transformToDto(c));

    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByName(name) {
    logger.info('CustomerService.getByName() invoked');

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const list = await Customer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByColor(colorOfVehicle) {
    logger.info('CustomerService.getByColor() invoked');

    const where = {};
    if (colorOfVehicle) {
      where.colorOfVehicle = { [Op.like]: `%${colorOfVehicle}%` };
    }

    const list = await Customer.findAll({
      where,
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByModel(modelId) {
    logger.info('CustomerService.getByModel() invoked');

    const list = await Customer.findAll({
      where: { modelId, isActive: true },
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async getByPayment(paymentId) {
    logger.info('CustomerService.getByPayment() invoked');

    const list = await Customer.findAll({
      where: { paymentId, isActive: true },
      include: defaultInclude,
      order: [['id', 'ASC']]
    });

    return list.map(c => this.transformToDto(c));
  }

  async update(customerDto) {
    logger.info('CustomerService.update() invoked');

    const customer = await Customer.findByPk(customerDto.id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const updateData = {
      name: customerDto.name,
      address: customerDto.address,
      province: customerDto.province,
      district: customerDto.district,
      occupation: customerDto.occupation,
      religion: customerDto.religion,
      nic: customerDto.nic,
      chassisNumber: customerDto.chassisNumber,
      motorNumber: customerDto.motorNumber,
      colorOfVehicle: customerDto.colorOfVehicle,
      isActive: customerDto.isActive !== undefined ? customerDto.isActive : customer.isActive
    };
    if (customerDto.modelId != null) updateData.modelId = customerDto.modelId;
    if (customerDto.paymentId != null) updateData.paymentId = customerDto.paymentId;
    if (customerDto.dateOfBirth !== undefined) updateData.dateOfBirth = customerDto.dateOfBirth;
    if (customerDto.contactNumber !== undefined) updateData.contactNumber = customerDto.contactNumber;
    if (customerDto.whatsappNumber !== undefined) updateData.whatsappNumber = customerDto.whatsappNumber;
    if (customerDto.dateOfPurchase !== undefined) updateData.dateOfPurchase = customerDto.dateOfPurchase;
    if (customerDto.loyalityCardNo !== undefined) updateData.loyalityCardNo = customerDto.loyalityCardNo;
    if (customerDto.dateOfDelivery !== undefined) updateData.dateOfDelivery = customerDto.dateOfDelivery;
    if (customerDto.sellingAmount !== undefined) updateData.sellingAmount = customerDto.sellingAmount;
    if (customerDto.registrationFees !== undefined) updateData.registrationFees = customerDto.registrationFees;
    if (customerDto.advancePaymentAmount !== undefined) updateData.advancePaymentAmount = customerDto.advancePaymentAmount;
    if (customerDto.advancePaymentDate !== undefined) updateData.advancePaymentDate = customerDto.advancePaymentDate;
    if (customerDto.balancePaymentAmount !== undefined) updateData.balancePaymentAmount = customerDto.balancePaymentAmount;
    if (customerDto.balancePaymentDate !== undefined) updateData.balancePaymentDate = customerDto.balancePaymentDate;

    await customer.update(updateData);

    const updated = await Customer.findByPk(customer.id, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  async updateStatus(customerId, status) {
    logger.info('CustomerService.updateStatus() invoked');

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return null;
    }

    await customer.update({ isActive: status });

    const updated = await Customer.findByPk(customerId, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  transformToDto(customer) {
    if (!customer) return null;
    return {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      province: customer.province,
      district: customer.district,
      occupation: customer.occupation,
      dateOfBirth: customer.dateOfBirth,
      religion: customer.religion,
      contactNumber: customer.contactNumber,
      whatsappNumber: customer.whatsappNumber,
      nic: customer.nic,
      modelId: customer.modelId,
      chassisNumber: customer.chassisNumber,
      motorNumber: customer.motorNumber,
      colorOfVehicle: customer.colorOfVehicle,
      dateOfPurchase: customer.dateOfPurchase,
      loyalityCardNo: customer.loyalityCardNo,
      dateOfDelivery: customer.dateOfDelivery,
      sellingAmount: customer.sellingAmount,
      registrationFees: customer.registrationFees,
      advancePaymentAmount: customer.advancePaymentAmount,
      advancePaymentDate: customer.advancePaymentDate,
      balancePaymentAmount: customer.balancePaymentAmount,
      balancePaymentDate: customer.balancePaymentDate,
      paymentId: customer.paymentId,
      isActive: customer.isActive,
      modelDto: customer.model
        ? {
            id: customer.model.id,
            categoryId: customer.model.categoryId,
            name: customer.model.name,
            imageUrl: customer.model.imageUrl,
            isActive: customer.model.isActive,
            categoryDto: customer.model.category
              ? { id: customer.model.category.id, name: customer.model.category.name, isActive: customer.model.category.isActive }
              : null
          }
        : null,
      paymentDto: customer.payment
        ? { id: customer.payment.id, name: customer.payment.name, isActive: customer.payment.isActive }
        : null
    };
  }
}

module.exports = new CustomerService();
