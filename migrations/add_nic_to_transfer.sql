-- Add NIC column to transfer table
ALTER TABLE `transfer` ADD COLUMN `nic` VARCHAR(255) DEFAULT NULL AFTER `deliveryDetails`;
