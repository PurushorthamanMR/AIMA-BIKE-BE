const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, UserRole } = require('../models');
const jwtUtil = require('../utils/jwtUtil');
const logger = require('../config/logger');
const emailService = require('./emailService');

function assertEmailVerified(userDto, emailAddress) {
  const token = userDto.emailVerificationToken;
  if (!token) {
    throw new Error('Email must be verified. Request an OTP and verify your email first.');
  }
  try {
    const decoded = jwtUtil.verifyToken(token);
    const verifiedEmail = (decoded.emailVerified || '').trim().toLowerCase();
    const requestedEmail = (emailAddress || '').trim().toLowerCase();
    if (verifiedEmail !== requestedEmail) {
      throw new Error('Email verification does not match. Please verify the email you are saving.');
    }
  } catch (err) {
    if (err.message && (err.message.includes('verified') || err.message.includes('match'))) throw err;
    throw new Error('Invalid or expired email verification. Please verify your email again.');
  }
}

class UserService {
  /**
   * Register a new user. Manager can only create Staff.
   */
  async registerUser(userDto, currentUserRole) {
    logger.info('UserService.registerUser() invoked');

    const emailAddress = (userDto.emailAddress || '').trim();
    if (!emailAddress) {
      throw new Error('Email address is required');
    }
    assertEmailVerified(userDto, emailAddress);

    const roleUpper = (currentUserRole || '').toUpperCase();
    const requestedRoleId = userDto.userRoleDto?.id || userDto.userRoleId;
    if (roleUpper === 'MANAGER') {
      const staffRole = await UserRole.findOne({ where: { userRole: 'STAFF' } });
      if (!staffRole || requestedRoleId !== staffRole.id) {
        throw new Error('Manager can only add Staff. Select Staff role.');
      }
    }

    const firstName = (userDto.firstName || '').trim();
    const lastName = (userDto.lastName || '').trim();
    if (firstName && lastName) {
      const existingByName = await User.findOne({
        where: { firstName, lastName }
      });
      if (existingByName) {
        throw new Error('First name and last name combination already exists.');
      }
    }

    // Check if user with email already exists
    const existingByEmail = await User.findOne({
      where: { emailAddress }
    });
    if (existingByEmail) {
      throw new Error('Email address already exists.');
    }

    const mobileNumber = (userDto.mobileNumber || '').trim();
    if (mobileNumber) {
      if (!/^\d{10}$/.test(mobileNumber)) {
        throw new Error('Mobile number must be exactly 10 digits.');
      }
      const existingByMobile = await User.findOne({
        where: { mobileNumber }
      });
      if (existingByMobile) {
        throw new Error('Mobile number already exists.');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Create user
    const user = await User.create({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      password: hashedPassword,
      address: userDto.address,
      emailAddress,
      mobileNumber: mobileNumber || null,
      isActive: userDto.isActive !== undefined ? userDto.isActive : true,
      userRoleId: userDto.userRoleDto?.id || userDto.userRoleId,
      createdDate: new Date()
    });

    // Load with associations
    const userWithAssociations = await User.findByPk(user.id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(userWithAssociations);
  }

  /**
   * Login user
   */
  async login(loginDto) {
    logger.info('UserService.login() invoked');
    
    const user = await User.findOne({
      where: { emailAddress: loginDto.username, isActive: true },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwtUtil.generateToken({
      sub: user.emailAddress,
      username: user.emailAddress,
      emailAddress: user.emailAddress,
      userId: user.id,
      role: user.userRole?.userRole
    });

    return {
      accessToken: token
    };
  }

  /**
   * Get all users with pagination. Manager sees only Manager + Staff (no Admin).
   */
  async getAll(pageNumber, pageSize, status, searchParams, currentUserRole) {
    logger.info('UserService.getAll() invoked');

    const where = {};
    if (status !== undefined && status !== null) {
      where.isActive = status;
    }
    if (searchParams) {
      if (searchParams.firstName) {
        where.firstName = { [Op.like]: `%${searchParams.firstName}%` };
      }
      if (searchParams.lastName) {
        where.lastName = { [Op.like]: `%${searchParams.lastName}%` };
      }
      if (searchParams.emailAddress) {
        where.emailAddress = { [Op.like]: `%${searchParams.emailAddress}%` };
      }
    }

    const roleUpper = (currentUserRole || '').toUpperCase();
    if (roleUpper === 'MANAGER') {
      const managerAndStaffRoles = await UserRole.findAll({
        where: { userRole: { [Op.in]: ['MANAGER', 'STAFF'] } },
        attributes: ['id']
      });
      const allowedRoleIds = managerAndStaffRoles.map((r) => r.id);
      if (allowedRoleIds.length > 0) {
        where.userRoleId = { [Op.in]: allowedRoleIds };
      } else {
        where.userRoleId = -1;
      }
    }

    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: UserRole, as: 'userRole' }],
      limit: pageSize,
      offset,
      order: [['createdDate', 'DESC']]
    });

    const users = rows.map(user => this.transformToDto(user));

    return {
      content: users,
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }

  /**
   * Get user by name
   */
  async getUserByName(firstName, lastName) {
    logger.info('UserService.getUserByName() invoked');
    
    const where = {};
    if (firstName) {
      where.firstName = { [Op.like]: `%${firstName}%` };
    }
    if (lastName) {
      where.lastName = { [Op.like]: `%${lastName}%` };
    }

    const users = await User.findAll({
      where,
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return users.map(user => this.transformToDto(user));
  }

  /**
   * Get user by ID. Manager can only view Staff or Manager (not Admin).
   */
  async getUserById(id, currentUserRole, currentUserId) {
    logger.info('UserService.getUserById() invoked');

    const user = await User.findByPk(id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });
    if (!user) return [];

    const roleUpper = (currentUserRole || '').toUpperCase();
    if (roleUpper === 'MANAGER') {
      const targetRole = (user.userRole?.userRole || '').toUpperCase();
      if (targetRole === 'ADMIN') {
        throw new Error('Insufficient permissions to view this user.');
      }
    }
    return [this.transformToDto(user)];
  }

  /**
   * Get users by role
   */
  async getUserByRole(userRole) {
    logger.info('UserService.getUserByRole() invoked');
    
    const role = await UserRole.findOne({ where: { userRole } });
    if (!role) {
      return [];
    }

    const users = await User.findAll({
      where: { userRoleId: role.id },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return users.map(user => this.transformToDto(user));
  }

  /**
   * Update user details. Manager can only edit Staff.
   */
  async updateUserDetails(userDto, currentUserRole) {
    logger.info('UserService.updateUserDetails() invoked');

    const user = await User.findByPk(userDto.id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });
    if (!user) {
      throw new Error('User not found');
    }

    const roleUpper = (currentUserRole || '').toUpperCase();
    if (roleUpper === 'MANAGER') {
      const targetRole = (user.userRole?.userRole || '').toUpperCase();
      if (targetRole !== 'STAFF') {
        throw new Error('Manager can only edit Staff users.');
      }
      // Manager must not change role to Admin or Manager
      const newRoleId = userDto.userRoleDto?.id || userDto.userRoleId;
      if (newRoleId != null) {
        const newRole = await UserRole.findByPk(newRoleId);
        if (newRole && (newRole.userRole || '').toUpperCase() !== 'STAFF') {
          throw new Error('Manager can only assign Staff role.');
        }
      }
    }

    const newFirstName = (userDto.firstName || '').trim();
    const newLastName = (userDto.lastName || '').trim();
    if (newFirstName && newLastName) {
      const existingByName = await User.findOne({
        where: { firstName: newFirstName, lastName: newLastName }
      });
      if (existingByName && existingByName.id !== user.id) {
        throw new Error('First name and last name combination already exists.');
      }
    }

    const newEmail = (userDto.emailAddress || '').trim();
    const currentEmail = (user.emailAddress || '').trim();
    if (newEmail && newEmail.toLowerCase() !== currentEmail.toLowerCase()) {
      assertEmailVerified(userDto, newEmail);
      const existingByEmail = await User.findOne({
        where: { emailAddress: newEmail }
      });
      if (existingByEmail && existingByEmail.id !== user.id) {
        throw new Error('Email address already exists.');
      }
    }

    const newMobile = (userDto.mobileNumber || '').trim();
    if (newMobile) {
      if (!/^\d{10}$/.test(newMobile)) {
        throw new Error('Mobile number must be exactly 10 digits.');
      }
      const existingByMobile = await User.findOne({
        where: { mobileNumber: newMobile }
      });
      if (existingByMobile && existingByMobile.id !== user.id) {
        throw new Error('Mobile number already exists.');
      }
    }

    await user.update({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      address: userDto.address,
      emailAddress: userDto.emailAddress,
      mobileNumber: userDto.mobileNumber,
      modifiedDate: new Date(),
      userRoleId: userDto.userRoleDto?.id || userDto.userRoleId || user.userRoleId
    });

    const updatedUser = await User.findByPk(user.id, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Update user status. Manager can only update Staff.
   */
  async updateUserStatus(userId, status, currentUserRole) {
    logger.info('UserService.updateUserStatus() invoked');

    const user = await User.findByPk(userId, {
      include: [{ model: UserRole, as: 'userRole' }]
    });
    if (!user) {
      return null;
    }
    const roleUpper = (currentUserRole || '').toUpperCase();
    if (roleUpper === 'MANAGER') {
      const targetRole = (user.userRole?.userRole || '').toUpperCase();
      if (targetRole !== 'STAFF') {
        throw new Error('Manager can only update status of Staff users.');
      }
    }

    await user.update({ isActive: status });

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Update password
   */
  async updatePassword(userId, password, changedByUserId) {
    logger.info('UserService.updatePassword() invoked');
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({
      password: hashedPassword,
      modifiedDate: new Date()
    });

    // Send email notification only if changed by admin/user
    if (changedByUserId) {
      try {
        const adminUser = await User.findByPk(changedByUserId);
        if (adminUser) {
          const emailText = `Your password has been changed by ${adminUser.firstName}.\nYour new password is: ${password}`;
          await emailService.sendEmail(
            user.emailAddress,
            'Password Change Notification',
            emailText
          );
        }
      } catch (error) {
        logger.error('Error sending password change notification email:', error);
        // Don't fail password update if email fails
      }
    }

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return this.transformToDto(updatedUser);
  }

  /**
   * Get user by email address
   */
  async getUserByEmailAddress(emailAddress) {
    logger.info('UserService.getUserByEmailAddress() invoked');
    
    const user = await User.findOne({
      where: { emailAddress },
      include: [{ model: UserRole, as: 'userRole' }]
    });

    return user ? [this.transformToDto(user)] : [];
  }

  /**
   * Transform user model to DTO
   */
  transformToDto(user) {
    if (!user) return null;
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      emailAddress: user.emailAddress,
      mobileNumber: user.mobileNumber,
      createdDate: user.createdDate,
      modifiedDate: user.modifiedDate,
      isActive: user.isActive,
      userRoleDto: user.userRole ? {
        id: user.userRole.id,
        userRole: user.userRole.userRole,
        isActive: user.userRole.isActive
      } : null
    };
  }
}

module.exports = new UserService();
