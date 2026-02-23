const { Op } = require('sequelize');
const { Customer, Model, Category, Payment, Cash, Lease } = require('../models');
const { sequelize } = require('../config/database');
const cashService = require('./cashService');
const leaseService = require('./leaseService');
const stockService = require('./stockService');
const logger = require('../config/logger');

const defaultInclude = [
  { model: Model, as: 'model', include: [{ model: Category, as: 'category' }] },
  { model: Payment, as: 'payment' },
  { model: Cash, as: 'cash', required: false },
  { model: Lease, as: 'lease', required: false }
];


class CustomerService {
  /**
   * Save customer and optionally Lease OR Cash based on paymentOption.
   * Reduces stock.quantity by 1 for the customer's model (matched by modelId and colorOfVehicle).
   * Body: { ...customerFields, paymentOption: 'lease'|'cash', leaseData?: {...}, cashData?: {...} }
   * Only one of leaseData or cashData is used, depending on paymentOption.
   */
  async saveWithPaymentOption(dto) {
    logger.info('CustomerService.saveWithPaymentOption() invoked');

    const { paymentOption, leaseData, cashData, ...customerFields } = dto;

    const modelId = customerFields.modelId ?? customerFields.model?.id;
    const paymentId = customerFields.paymentId ?? customerFields.payment?.id;

    const modelExists = await Model.findByPk(modelId);
    if (!modelExists) {
      throw new Error(`Model with id ${modelId} not found. Create a Category first, then a Model (e.g. POST /category/save, then POST /model/save), and use a valid modelId.`);
    }
    const paymentExists = await Payment.findByPk(paymentId);
    if (!paymentExists) {
      throw new Error(`Payment with id ${paymentId} not found. Create a Payment first (e.g. POST /payment/save) and use a valid paymentId.`);
    }

    const transaction = await sequelize.transaction();
    try {
      const customer = await Customer.create(
        {
          name: customerFields.name,
          address: customerFields.address,
          province: customerFields.province,
          district: customerFields.district,
          occupation: customerFields.occupation,
          dateOfBirth: customerFields.dateOfBirth ?? null,
          religion: customerFields.religion,
          contactNumber: customerFields.contactNumber ?? null,
          whatsappNumber: customerFields.whatsappNumber ?? null,
          nic: customerFields.nic,
          modelId: customerFields.modelId ?? customerFields.model?.id,
          chassisNumber: customerFields.chassisNumber,
          motorNumber: customerFields.motorNumber,
          colorOfVehicle: customerFields.colorOfVehicle,
          dateOfPurchase: customerFields.dateOfPurchase ?? null,
          loyalityCardNo: customerFields.loyalityCardNo ?? null,
          dateOfDelivery: customerFields.dateOfDelivery ?? null,
          sellingAmount: customerFields.sellingAmount ?? null,
          registrationFees: customerFields.registrationFees ?? null,
          advancePaymentAmount: customerFields.advancePaymentAmount ?? null,
          advancePaymentDate: customerFields.advancePaymentDate != null && customerFields.advancePaymentDate !== ''
            ? customerFields.advancePaymentDate
            : new Date().toISOString().split('T')[0],
          balancePaymentAmount: customerFields.balancePaymentAmount ?? null,
          balancePaymentDate: customerFields.balancePaymentDate ?? null,
          paymentId: customerFields.paymentId ?? customerFields.payment?.id,
          isActive: customerFields.isActive !== undefined ? customerFields.isActive : true,
          status: 'pending'
        },
        { transaction }
      );

      let leaseDto = null;
      let cashDto = null;
      if (paymentOption === 'lease' && leaseData) {
        leaseDto = await leaseService.saveWithTransaction({ ...leaseData, customerId: customer.id }, transaction);
      } else if (paymentOption === 'cash' && cashData) {
        cashDto = await cashService.saveWithTransaction({ ...cashData, customerId: customer.id }, transaction);
      }

      // Reduce stock by 1 for the customer's model (match by modelId and colorOfVehicle)
      await stockService.reduceQuantityByModel(customer.modelId, 1, {
        color: customerFields.colorOfVehicle || undefined,
        transaction
      });

      await transaction.commit();

      const withAssoc = await Customer.findByPk(customer.id, { include: defaultInclude });
      const customerDto = this.transformToDto(withAssoc);

      return { customerDto, leaseDto, cashDto };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
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

  /**
   * Get customers by workflow status (pending|complete|return) with pagination and optional isActive filter.
   * GET /customer/getByCustomerStatus?status=pending&pageNumber=1&pageSize=10&isActive=true
   */
  async getByCustomerStatus(customerStatus, pageNumber = 1, pageSize = 10, isActive) {
    logger.info('CustomerService.getByCustomerStatus() invoked');

    const where = {};
    if (customerStatus != null && customerStatus !== '') {
      where.status = customerStatus;
    }
    if (isActive !== undefined && isActive !== null) {
      where.isActive = isActive;
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Customer.findAndCountAll({
      where,
      include: defaultInclude,
      limit: pageSize,
      offset,
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

  /**
   * Approve customer: set status = 'complete', and set balancePaymentDate and dateOfDelivery to today.
   * POST /customer/approved?customerId=1
   */
  async approve(customerId) {
    logger.info('CustomerService.approve() invoked');

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return null;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD for DATEONLY
    await customer.update({
      status: 'complete',
      balancePaymentDate: today,
      dateOfDelivery: today
    });

    const updated = await Customer.findByPk(customerId, { include: defaultInclude });
    return this.transformToDto(updated);
  }

  /**
   * Return customer: set status = 'return' and restore stock.quantity by 1 (same modelId + colorOfVehicle).
   * POST /customer/return?customerId=1
   */
  async returnCustomer(customerId) {
    logger.info('CustomerService.returnCustomer() invoked');

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return null;
    }

    await customer.update({ status: 'return' });

    // Restore quantity +1 to the stock that was reduced when customer was created
    await stockService.addQuantityByModel(customer.modelId, 1, {
      color: customer.colorOfVehicle || undefined
    });

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
      status: customer.status,
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
        : null,
      cashData: this._cashToDto(customer.cash),
      leaseData: this._leaseToDto(customer.lease)
    };
  }

  _cashToDto(cash) {
    const list = Array.isArray(cash) ? cash : (cash ? [cash] : []);
    if (list.length === 0) return null;
    const c = list[0];
    return {
      id: c.id,
      customerId: c.customerId,
      copyOfNic: c.copyOfNic,
      photographOne: c.photographOne,
      photographTwo: c.photographTwo,
      paymentReceipt: c.paymentReceipt,
      mta2: c.mta2,
      slip: c.slip,
      chequeNumber: c.chequeNumber,
      isActive: c.isActive
    };
  }

  _leaseToDto(lease) {
    const list = Array.isArray(lease) ? lease : (lease ? [lease] : []);
    if (list.length === 0) return null;
    const l = list[0];
    return {
      id: l.id,
      customerId: l.customerId,
      companyName: l.companyName,
      purchaseOrderNumber: l.purchaseOrderNumber,
      copyOfNic: l.copyOfNic,
      photographOne: l.photographOne,
      photographTwo: l.photographTwo,
      paymentReceipt: l.paymentReceipt,
      mta2: l.mta2,
      mta3: l.mta3,
      chequeNumber: l.chequeNumber,
      isActive: l.isActive
    };
  }
}

module.exports = new CustomerService();
