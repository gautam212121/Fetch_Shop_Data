-- India Shop Data Extractor - Database Setup SQL
-- Import this file in XAMPP phpMyAdmin to create the database and tables

-- Create Database
CREATE DATABASE IF NOT EXISTS `shopdb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `shopdb`;

-- Create Shop Table
CREATE TABLE IF NOT EXISTS `Shop` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `shopName` VARCHAR(191) NOT NULL,
  `ownerName` VARCHAR(191),
  `phone` VARCHAR(191),
  `address` LONGTEXT,
  `district` VARCHAR(191) NOT NULL,
  `state` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `pincode` VARCHAR(191),
  `onlineStatus` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Shop_district_idx` (`district`),
  INDEX `Shop_state_idx` (`state`),
  INDEX `Shop_category_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add sample data (optional - remove if not needed)
INSERT INTO `Shop` (`shopName`, `district`, `state`, `category`, `onlineStatus`, `createdAt`, `updatedAt`)
VALUES 
  ('ABC Electronics', 'Agra', 'Uttar Pradesh', 'Electronics Shops', 1, NOW(), NOW()),
  ('XYZ Kirana Store', 'Agra', 'Uttar Pradesh', 'Grocery', 0, NOW(), NOW()),
  ('Fashion Hub', 'Agra', 'Uttar Pradesh', 'Fashion', 1, NOW(), NOW());
