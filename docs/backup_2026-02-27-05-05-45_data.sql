-- AIMA Bike DB Backup
-- Generated: 2026-02-27T05:05:45.963Z


-- Data: category
LOCK TABLES `category` WRITE;
INSERT INTO `category` (`id`, `name`, `isActive`) VALUES (1,'Bikes',1);
INSERT INTO `category` (`id`, `name`, `isActive`) VALUES (2,'Parts',1);
INSERT INTO `category` (`id`, `name`, `isActive`) VALUES (3,'Services',1);
UNLOCK TABLES;

-- Data: dealerconsignmentnote
LOCK TABLES `dealerconsignmentnote` WRITE;
INSERT INTO `dealerconsignmentnote` (`id`, `dealerCode`, `dealerName`, `address`, `consignmentNoteNo`, `date`, `deliveryMode`, `vehicleNo`, `references`, `contactPerson`, `isActive`) VALUES (1,'DC001','ABC Motors','123 Main St','CN-2025-001','2025-02-23','By Road','MH-01-AB-1234','PO-123','0765786336',1);
INSERT INTO `dealerconsignmentnote` (`id`, `dealerCode`, `dealerName`, `address`, `consignmentNoteNo`, `date`, `deliveryMode`, `vehicleNo`, `references`, `contactPerson`, `isActive`) VALUES (2,'DC002','YT Motors','123 Main St','CN-2025-001','2025-02-23','By Road','MH-01-AB-1234','PO-123','0756753974',1);
UNLOCK TABLES;

-- Data: model
LOCK TABLES `model` WRITE;
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (1,1,'Aria','upload/bike-models/1772167559018_image',1);
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (2,1,'Breezy','upload/bike-models/1772167571680_image',1);
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (3,1,'JoyBean','upload/bike-models/1772167582959_image',1);
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (4,1,'Liberty','upload/bike-models/1772167594204_image',1);
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (5,1,'Mana','upload/bike-models/1772167607229_image',1);
INSERT INTO `model` (`id`, `categoryId`, `name`, `imageUrl`, `isActive`) VALUES (6,1,'Maverich','upload/bike-models/1772167627095_image',1);
UNLOCK TABLES;

-- Data: payment
LOCK TABLES `payment` WRITE;
INSERT INTO `payment` (`id`, `name`, `isActive`) VALUES (1,'Cash',1);
UNLOCK TABLES;

-- Data: settings
LOCK TABLES `settings` WRITE;
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (1,'Dashboard',1,0);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (2,'POS',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (3,'Payment',1,0);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (4,'Reports',1,0);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (5,'Stock',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (6,'Models',1,0);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (7,'Category',0,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (8,'Transfer',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (9,'Customers',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (10,'Dealer',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (11,'Courier',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (12,'Profile',1,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (13,'User',1,0);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (14,'Shop Detail',0,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (15,'Settings',0,1);
INSERT INTO `settings` (`id`, `name`, `isActiveAdmin`, `isActiveManager`) VALUES (16,'Database',0,1);
UNLOCK TABLES;

-- Data: stock
LOCK TABLES `stock` WRITE;
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (31,1,6,'BIKE-GREY','CH605','MN605','GREY',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (32,1,6,'BIKE-GREY','CH604','MN604','GREY',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (33,1,6,'BIKE-GREY','CH603','MN603','GREY',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (34,1,6,'BIKE-GREY','CH602','MN602','GREY',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (35,1,6,'BIKE-GREY','CH601','MN601','GREY',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (36,1,5,'BIKE-SILVE','CH505','MN505','SILVER',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (37,1,5,'BIKE-SILVE','CH504','MN504','SILVER',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (38,1,5,'BIKE-SILVE','CH503','MN503','SILVER',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (39,1,5,'BIKE-SILVE','CH502','MN502','SILVER',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (40,1,5,'BIKE-SILVE','CH501','MN501','SILVER',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (41,1,4,'BIKE-WHITE','CH405','MN405','WHITE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (42,1,4,'BIKE-WHITE','CH404','MN404','WHITE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (43,1,4,'BIKE-WHITE','CH403','MN403','WHITE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (44,1,4,'BIKE-WHITE','CH402','MN402','WHITE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (45,1,4,'BIKE-WHITE','CH401','MN401','WHITE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (46,1,3,'BIKE-BLUE','CH305','MN305','BLUE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (47,1,3,'BIKE-BLUE','CH304','MN304','BLUE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (48,1,3,'BIKE-BLUE','CH303','MN303','BLUE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (49,1,3,'BIKE-BLUE','CH302','MN302','BLUE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (50,1,3,'BIKE-BLUE','CH301','MN301','BLUE',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (51,1,2,'BIKE-RED','CH205','MN205','RED',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (52,1,2,'BIKE-RED','CH204','MN204','RED',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (53,1,2,'BIKE-RED','CH203','MN203','RED',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (54,1,2,'BIKE-RED','CH202','MN202','RED',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (55,1,2,'BIKE-RED','CH201','MN201','RED',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (56,1,1,'BIKE-BLACK','CH105','MN105','BLACK',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (57,1,1,'BIKE-BLACK','CH104','MN104','BLACK',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (58,1,1,'BIKE-BLACK','CH103','MN103','BLACK',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (59,1,1,'BIKE-BLACK','CH102','MN102','BLACK',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (60,1,1,'BIKE-BLACK','CH101','MN101','BLACK',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (61,2,1,'BIKE-001','CH101','MN101','Black',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (62,2,1,'BIKE-001','CH102','MN102','Red',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (63,2,1,'BIKE-001','CH103','MN103','Blue',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (64,2,1,'BIKE-001','CH104','MN104','White',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (65,2,1,'BIKE-001','CH105','MN105','Silver',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (66,2,2,'BIKE-002','CH201','MN201','Grey',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (67,2,2,'BIKE-002','CH202','MN202','Navy Blue',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (68,2,2,'BIKE-002','CH203','MN203','Green',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (69,2,2,'BIKE-002','CH204','MN204','Yellow',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (70,2,2,'BIKE-002','CH205','MN205','Orange',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (71,2,3,'BIKE-003','CH301','MN301','Maroon',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (72,2,3,'BIKE-003','CH302','MN302','Pearl White',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (73,2,3,'BIKE-003','CH303','MN303','Matte Black',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (74,2,3,'BIKE-003','CH304','MN304','Burgundy',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (75,2,3,'BIKE-003','CH305','MN305','Teal',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (76,2,4,'BIKE-004','CH401','MN401','Brown',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (77,2,4,'BIKE-004','CH402','MN402','Gold',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (78,2,4,'BIKE-004','CH403','MN403','Bronze',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (79,2,4,'BIKE-004','CH404','MN404','Graphite',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (80,2,4,'BIKE-004','CH405','MN405','Crimson',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (81,2,5,'BIKE-005','CH501','MN501','Ivory',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (82,2,5,'BIKE-005','CH502','MN502','Charcoal',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (83,2,5,'BIKE-005','CH503','MN503','Sky Blue',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (84,2,5,'BIKE-005','CH504','MN504','Lime Green',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (85,2,5,'BIKE-005','CH505','MN505','Purple',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (86,2,6,'BIKE-006','CH601','MN601','Metallic Red',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (87,2,6,'BIKE-006','CH602','MN602','Metallic Blue',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (88,2,6,'BIKE-006','CH603','MN603','Metallic Grey',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (89,2,6,'BIKE-006','CH604','MN604','Beige',1);
INSERT INTO `stock` (`id`, `noteId`, `modelId`, `itemCode`, `chassisNumber`, `motorNumber`, `color`, `quantity`) VALUES (90,2,6,'BIKE-006','CH605','MN605','Copper',1);
UNLOCK TABLES;

-- Data: user
LOCK TABLES `user` WRITE;
INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `address`, `emailAddress`, `mobileNumber`, `createdDate`, `modifiedDate`, `isActive`, `userRoleId`) VALUES (1,'Prusothaman','MR','$2a$10$fT0hHwGvPEmuSZVGjc40burckiIBbrkzuBF9lFmbRCFLduwZSK7A2','Jaffna','mrprusothaman@gmail.com','0765947337','2026-02-27 04:27:52','2026-02-27 04:31:07',1,1);
INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `address`, `emailAddress`, `mobileNumber`, `createdDate`, `modifiedDate`, `isActive`, `userRoleId`) VALUES (2,'Muhila','Vijayakumar','$2a$10$rNENdXBwTDJ4PVnAJDWdQ.UC.I0b6lwcJZV.r8Xl1RqWfas0oPDam','Pollikandy','muhilavijayakumar26@gmail.com','0755364135','2026-02-27 04:37:09',NULL,1,2);
INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `address`, `emailAddress`, `mobileNumber`, `createdDate`, `modifiedDate`, `isActive`, `userRoleId`) VALUES (3,'Nizmi','Nivin','$2a$10$t0r.BOJeFIQ7z2hr/NCXyOjme5eL.TLBNGEgwidj/vJbl20SDsY2O','Neliadi','nivinnizmi@gmail.com','0755465765','2026-02-27 04:44:44',NULL,1,3);
UNLOCK TABLES;

-- Data: userrole
LOCK TABLES `userrole` WRITE;
INSERT INTO `userrole` (`id`, `userRole`, `isActive`) VALUES (1,'Admin',1);
INSERT INTO `userrole` (`id`, `userRole`, `isActive`) VALUES (2,'Manager',1);
INSERT INTO `userrole` (`id`, `userRole`, `isActive`) VALUES (3,'Staff',1);
UNLOCK TABLES;
