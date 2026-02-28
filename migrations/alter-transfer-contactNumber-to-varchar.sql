-- Run this once to fix "Out of range value for column 'contactNumber'".
-- INT max is 2,147,483,647; 10-digit numbers like 7846735672 exceed it.
-- VARCHAR(15) stores any 10-digit string (including leading zero).

ALTER TABLE `transfer` MODIFY COLUMN `contactNumber` VARCHAR(15) NULL;
