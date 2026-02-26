-- Create settings table
-- Columns: id, name, isActiveAdmin, isActiveManager

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `isActiveAdmin` tinyint(1) DEFAULT 1,
  `isActiveManager` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
