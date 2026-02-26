-- Create email_verification table for OTP-based email verification
CREATE TABLE IF NOT EXISTS `email_verification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emailAddress` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email_verification_email` (`emailAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
