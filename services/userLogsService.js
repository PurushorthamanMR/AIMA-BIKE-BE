const { Op } = require('sequelize');
const { UserLogs, User } = require('../models');
const logger = require('../config/logger');

class UserLogsService {
  async login(userLogsDto) {
    logger.info('UserLogsService.login() invoked');

    const userLog = await UserLogs.create({
      userId: userLogsDto.userDto?.id || userLogsDto.userId,
      action: 'Login',
      timestamp: new Date()
    });

    const userLogWithAssociations = await UserLogs.findByPk(userLog.id, {
      include: [{ model: User, as: 'user' }]
    });

    return this.transformToDto(userLogWithAssociations);
  }

  async save(userLogsDto) {
    logger.info('UserLogsService.save() invoked');

    const userLog = await UserLogs.create({
      userId: userLogsDto.userDto?.id || userLogsDto.userId,
      action: userLogsDto.action || 'Activity',
      timestamp: userLogsDto.timestamp ? new Date(userLogsDto.timestamp) : new Date()
    });

    const userLogWithAssociations = await UserLogs.findByPk(userLog.id, {
      include: [{ model: User, as: 'user' }]
    });

    return this.transformToDto(userLogWithAssociations);
  }

  async getAllPageUserLogs(pageNumber, pageSize, status, searchParams) {
    logger.info('UserLogsService.getAllPageUserLogs() invoked');

    const where = {};

    if (searchParams?.action) {
      where.action = { [Op.like]: `%${searchParams.action}%` };
    }

    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await UserLogs.findAndCountAll({
      where,
      include: [{ model: User, as: 'user' }],
      limit: pageSize,
      offset: offset,
      order: [['timestamp', 'DESC']]
    });

    const userLogs = rows.map(log => this.transformToDto(log));

    return {
      content: userLogs,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  transformToDto(userLog) {
    if (!userLog) return null;

    return {
      id: userLog.id,
      action: userLog.action,
      timestamp: userLog.timestamp,
      userDto: userLog.user
        ? {
            id: userLog.user.id,
            firstName: userLog.user.firstName,
            lastName: userLog.user.lastName,
            emailAddress: userLog.user.emailAddress
          }
        : null
    };
  }
}

module.exports = new UserLogsService();
