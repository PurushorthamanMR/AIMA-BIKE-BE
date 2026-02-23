const { Op } = require('sequelize');
const {
  DealerConsignmentNote,
  DealerConsignmentNoteItem,
  Model,
  Category
} = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../config/logger');
const stockService = require('./stockService');

const itemInclude = [
  { model: Model, as: 'model', include: [{ model: Category, as: 'category' }] }
];

function getNoteInclude() {
  return [
    {
      model: DealerConsignmentNoteItem,
      as: 'items',
      include: itemInclude
    }
  ];
}

class DealerConsignmentNoteService {
  async save(dto) {
    logger.info('DealerConsignmentNoteService.save() invoked');

    const transaction = await sequelize.transaction();
    try {
      const note = await DealerConsignmentNote.create(
        {
          dealerCode: dto.dealerCode,
          dealerName: dto.dealerName,
          address: dto.address ?? null,
          consignmentNoteNo: dto.consignmentNoteNo,
          date: dto.date ?? null,
          deliveryMode: dto.deliveryMode ?? null,
          vehicleNo: dto.vehicleNo ?? null,
          references: dto.references ?? null,
          contactPerson: dto.contactPerson ?? null,
          isActive: dto.isActive !== undefined ? dto.isActive : true
        },
        { transaction }
      );

      const items = Array.isArray(dto.items) ? dto.items : [];
      if (items.length > 0) {
        await DealerConsignmentNoteItem.bulkCreate(
          items.map((item) => ({
            noteId: note.id,
            modelId: item.modelId,
            stockId: item.stockId ?? null,
            itemCode: item.itemCode ?? null,
            chassisNumber: item.chassisNumber ?? null,
            motorNumber: item.motorNumber ?? null,
            color: item.color ?? null,
            quantity: item.quantity ?? 1
          })),
          { transaction }
        );
        // Increase stock quantity for each consignment item
        for (const item of items) {
          const qty = item.quantity ?? 1;
          if (item.stockId != null) {
            await stockService.addQuantityByStockId(item.stockId, qty, { transaction });
          } else {
            await stockService.addQuantityByModelOrCreate(item.modelId, qty, {
              color: item.color || undefined,
              itemCode: item.itemCode || undefined,
              transaction
            });
          }
        }
      }

      await transaction.commit();

      const withItems = await DealerConsignmentNote.findByPk(note.id, {
        include: getNoteInclude()
      });
      return this.transformToDto(withItems);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getAllPage(pageNumber, pageSize, status, searchParams) {
    logger.info('DealerConsignmentNoteService.getAllPage() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams?.dealerCode) {
      where.dealerCode = { [Op.like]: `%${searchParams.dealerCode}%` };
    }
    if (searchParams?.dealerName) {
      where.dealerName = { [Op.like]: `%${searchParams.dealerName}%` };
    }
    if (searchParams?.consignmentNoteNo) {
      where.consignmentNoteNo = { [Op.like]: `%${searchParams.consignmentNoteNo}%` };
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await DealerConsignmentNote.findAndCountAll({
      where,
      include: getNoteInclude(),
      limit: pageSize,
      offset,
      order: [['id', 'ASC']]
    });

    const content = rows.map((n) => this.transformToDto(n));
    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber,
      pageSize
    };
  }

  async getByDealerCode(dealerCode) {
    logger.info('DealerConsignmentNoteService.getByDealerCode() invoked');

    const where = {};
    if (dealerCode) {
      where.dealerCode = { [Op.like]: `%${dealerCode}%` };
    }

    const notes = await DealerConsignmentNote.findAll({
      where,
      include: getNoteInclude(),
      order: [['id', 'ASC']]
    });
    return notes.map((n) => this.transformToDto(n));
  }

  async getByDealerName(dealerName) {
    logger.info('DealerConsignmentNoteService.getByDealerName() invoked');

    const where = {};
    if (dealerName) {
      where.dealerName = { [Op.like]: `%${dealerName}%` };
    }

    const notes = await DealerConsignmentNote.findAll({
      where,
      include: getNoteInclude(),
      order: [['id', 'ASC']]
    });
    return notes.map((n) => this.transformToDto(n));
  }

  async getByConsignmentNoteNo(consignmentNoteNo) {
    logger.info('DealerConsignmentNoteService.getByConsignmentNoteNo() invoked');

    const note = await DealerConsignmentNote.findOne({
      where: { consignmentNoteNo: consignmentNoteNo || '' },
      include: getNoteInclude()
    });
    return note ? this.transformToDto(note) : null;
  }

  async update(dto) {
    logger.info('DealerConsignmentNoteService.update() invoked');

    const note = await DealerConsignmentNote.findByPk(dto.id);
    if (!note) {
      throw new Error('Dealer consignment note not found');
    }

    const transaction = await sequelize.transaction();
    try {
      await note.update(
        {
          dealerCode: dto.dealerCode ?? note.dealerCode,
          dealerName: dto.dealerName ?? note.dealerName,
          address: dto.address !== undefined ? dto.address : note.address,
          consignmentNoteNo: dto.consignmentNoteNo ?? note.consignmentNoteNo,
          date: dto.date !== undefined ? dto.date : note.date,
          deliveryMode: dto.deliveryMode !== undefined ? dto.deliveryMode : note.deliveryMode,
          vehicleNo: dto.vehicleNo !== undefined ? dto.vehicleNo : note.vehicleNo,
          references: dto.references !== undefined ? dto.references : note.references,
          contactPerson: dto.contactPerson !== undefined ? dto.contactPerson : note.contactPerson,
          isActive: dto.isActive !== undefined ? dto.isActive : note.isActive
        },
        { transaction }
      );

      await DealerConsignmentNoteItem.destroy({
        where: { noteId: note.id },
        transaction
      });

      const items = Array.isArray(dto.items) ? dto.items : [];
      if (items.length > 0) {
        await DealerConsignmentNoteItem.bulkCreate(
          items.map((item) => ({
            noteId: note.id,
            modelId: item.modelId,
            stockId: item.stockId ?? null,
            itemCode: item.itemCode ?? null,
            chassisNumber: item.chassisNumber ?? null,
            motorNumber: item.motorNumber ?? null,
            color: item.color ?? null,
            quantity: item.quantity ?? 1
          })),
          { transaction }
        );
      }

      await transaction.commit();

      const updated = await DealerConsignmentNote.findByPk(note.id, {
        include: getNoteInclude()
      });
      return this.transformToDto(updated);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateStatus(noteId, status) {
    logger.info('DealerConsignmentNoteService.updateStatus() invoked');

    const note = await DealerConsignmentNote.findByPk(noteId);
    if (!note) {
      return null;
    }

    await note.update({ isActive: status });

    const updated = await DealerConsignmentNote.findByPk(noteId, {
      include: getNoteInclude()
    });
    return this.transformToDto(updated);
  }

  transformItemToDto(item) {
    if (!item) return null;
    return {
      id: item.id,
      noteId: item.noteId,
      modelId: item.modelId,
      stockId: item.stockId,
      itemCode: item.itemCode,
      chassisNumber: item.chassisNumber,
      motorNumber: item.motorNumber,
      color: item.color,
      quantity: item.quantity,
      modelDto: item.model
        ? {
            id: item.model.id,
            categoryId: item.model.categoryId,
            name: item.model.name,
            imageUrl: item.model.imageUrl,
            isActive: item.model.isActive,
            categoryDto: item.model.category
              ? {
                  id: item.model.category.id,
                  name: item.model.category.name,
                  isActive: item.model.category.isActive
                }
              : null
          }
        : null
    };
  }

  transformToDto(note) {
    if (!note) return null;
    return {
      id: note.id,
      dealerCode: note.dealerCode,
      dealerName: note.dealerName,
      address: note.address,
      consignmentNoteNo: note.consignmentNoteNo,
      date: note.date,
      deliveryMode: note.deliveryMode,
      vehicleNo: note.vehicleNo,
      references: note.references,
      contactPerson: note.contactPerson,
      isActive: note.isActive,
      items: (note.items || []).map((i) => this.transformItemToDto(i))
    };
  }
}

module.exports = new DealerConsignmentNoteService();
