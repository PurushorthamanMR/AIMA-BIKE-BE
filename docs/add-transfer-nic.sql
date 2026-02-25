-- Add missing 'nic' column to transfer table (fix: Unknown column 'nic' in 'field list')
-- Run this once on your database if you get that error.

ALTER TABLE `transfer` ADD COLUMN `nic` VARCHAR(255) DEFAULT NULL AFTER `deliveryDetails`;
