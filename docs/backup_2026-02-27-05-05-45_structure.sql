-- AIMA Bike DB Backup
-- Generated: 2026-02-27T05:05:45.963Z


-- Table: cash
DROP TABLE IF EXISTS `cash`;
CREATE TABLE `cash` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `copyOfNic` varchar(255) DEFAULT NULL,
  `photographOne` varchar(255) DEFAULT NULL,
  `photographTwo` varchar(255) DEFAULT NULL,
  `paymentReceipt` varchar(255) DEFAULT NULL,
  `mta2` varchar(255) DEFAULT NULL,
  `slip` varchar(255) DEFAULT NULL,
  `chequeNumber` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `cash_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: category
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: courier
DROP TABLE IF EXISTS `courier`;
CREATE TABLE `courier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `customerId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `contactNumber` int DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `sentDate` date DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `receivername` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `courier_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `courier_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: customer
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `religion` varchar(255) NOT NULL,
  `contactNumber` int DEFAULT NULL,
  `whatsappNumber` int DEFAULT NULL,
  `nic` varchar(255) NOT NULL,
  `modelId` int NOT NULL,
  `chassisNumber` varchar(255) NOT NULL,
  `motorNumber` varchar(255) NOT NULL,
  `colorOfVehicle` varchar(255) NOT NULL,
  `dateOfPurchase` date DEFAULT NULL,
  `loyalityCardNo` int DEFAULT NULL,
  `dateOfDelivery` date DEFAULT NULL,
  `sellingAmount` double DEFAULT NULL,
  `registrationFees` double DEFAULT NULL,
  `advancePaymentAmount` double DEFAULT NULL,
  `advancePaymentDate` date DEFAULT NULL,
  `balancePaymentAmount` double DEFAULT NULL,
  `balancePaymentDate` date DEFAULT NULL,
  `paymentId` int NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `status` varchar(255) DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `modelId` (`modelId`),
  KEY `paymentId` (`paymentId`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`paymentId`) REFERENCES `payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: dealerconsignmentnote
DROP TABLE IF EXISTS `dealerconsignmentnote`;
CREATE TABLE `dealerconsignmentnote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealerCode` varchar(255) NOT NULL,
  `dealerName` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `consignmentNoteNo` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `deliveryMode` varchar(255) DEFAULT NULL,
  `vehicleNo` varchar(255) DEFAULT NULL,
  `references` varchar(255) DEFAULT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: email_verification
DROP TABLE IF EXISTS `email_verification`;
CREATE TABLE `email_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emailAddress` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: lease
DROP TABLE IF EXISTS `lease`;
CREATE TABLE `lease` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `purchaseOrderNumber` int DEFAULT NULL,
  `copyOfNic` varchar(255) DEFAULT NULL,
  `photographOne` varchar(255) DEFAULT NULL,
  `photographTwo` varchar(255) DEFAULT NULL,
  `paymentReceipt` varchar(255) DEFAULT NULL,
  `mta2` varchar(255) DEFAULT NULL,
  `mta3` varchar(255) DEFAULT NULL,
  `chequeNumber` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `lease_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: model
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `model_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: passwordresettoken
DROP TABLE IF EXISTS `passwordresettoken`;
CREATE TABLE `passwordresettoken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `passwordresettoken_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: payment
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `isActiveAdmin` tinyint(1) DEFAULT '1',
  `isActiveManager` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: shopdetails
DROP TABLE IF EXISTS `shopdetails`;
CREATE TABLE `shopdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: stock
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `noteId` int NOT NULL,
  `modelId` int NOT NULL,
  `itemCode` varchar(255) DEFAULT NULL,
  `chassisNumber` varchar(255) DEFAULT NULL,
  `motorNumber` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `noteId` (`noteId`),
  KEY `modelId` (`modelId`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`noteId`) REFERENCES `dealerconsignmentnote` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`modelId`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: transfer
DROP TABLE IF EXISTS `transfer`;
CREATE TABLE `transfer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) NOT NULL,
  `contactNumber` int DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `deliveryDetails` varchar(255) NOT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `transfer_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: transferlist
DROP TABLE IF EXISTS `transferlist`;
CREATE TABLE `transferlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transferId` int NOT NULL,
  `stockId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `transferId` (`transferId`),
  KEY `stockId` (`stockId`),
  CONSTRAINT `transferlist_ibfk_1` FOREIGN KEY (`transferId`) REFERENCES `transfer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transferlist_ibfk_2` FOREIGN KEY (`stockId`) REFERENCES `stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `emailAddress` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `userRoleId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `emailAddress` (`emailAddress`),
  KEY `userRoleId` (`userRoleId`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`userRoleId`) REFERENCES `userrole` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: userlogs
DROP TABLE IF EXISTS `userlogs`;
CREATE TABLE `userlogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userlogs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: userrole
DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userRole` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
