-- Bsissa Database Schema
-- Complete MySQL Database Creation Script
-- Generated from Laravel Migration Analysis

SET FOREIGN_KEY_CHECKS=0;

-- ============================================================================
-- TABLE: users
-- Description: User accounts and authentication
-- ============================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(255) NULL,
  `address_line1` VARCHAR(255) NULL,
  `address_line2` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `state` VARCHAR(255) NULL,
  `postal_code` VARCHAR(255) NULL,
  `country` VARCHAR(255) NOT NULL DEFAULT 'Tunisie',
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `two_factor_secret` TEXT NULL,
  `two_factor_recovery_codes` TEXT NULL,
  `two_factor_confirmed_at` TIMESTAMP NULL,
  `role` ENUM('admin', 'vendeur', 'client') NOT NULL DEFAULT 'client',
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: password_reset_tokens
-- Description: Password reset token storage
-- ============================================================================
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: sessions
-- Description: User session management
-- ============================================================================
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,

  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_last_activity` (`last_activity`),
  FOREIGN KEY `fk_sessions_user_id` (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: cache
-- Description: Cache storage for Laravel cache
-- ============================================================================
CREATE TABLE IF NOT EXISTS `cache` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL,

  INDEX `idx_expiration` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: cache_locks
-- Description: Cache lock mechanism
-- ============================================================================
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL,

  INDEX `idx_expiration` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: jobs
-- Description: Job queue entries
-- ============================================================================
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,

  INDEX `idx_queue` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: job_batches
-- Description: Job batch tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: failed_jobs
-- Description: Failed job logging
-- ============================================================================
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(255) NOT NULL UNIQUE,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: categories
-- Description: Product categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_by` BIGINT UNSIGNED NULL,
  `updated_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_slug` (`slug`),
  INDEX `idx_created_by` (`created_by`),
  INDEX `idx_updated_by` (`updated_by`),
  FOREIGN KEY `fk_categories_created_by` (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_categories_updated_by` (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: products
-- Description: Main product catalog
-- Details: After migrations, price, promotional_price, weight_kg, and stock_quantity
--          have been moved to product_weight_variants table
-- ============================================================================
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `detailed_description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `category_id` BIGINT UNSIGNED NULL,
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `ingredients` TEXT NULL,
  `marketing_tags` VARCHAR(500) NULL,
  `calories_kcal` DECIMAL(6, 1) NULL,
  `protein_g` DECIMAL(5, 1) NULL,
  `carbs_g` DECIMAL(5, 1) NULL,
  `fat_g` DECIMAL(5, 1) NULL,
  `fiber_g` DECIMAL(5, 1) NULL,
  `created_by` BIGINT UNSIGNED NULL,
  `updated_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_name_description` (`name`, `description`),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_is_featured` (`is_featured`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_category_featured` (`category_id`, `is_featured`),
  INDEX `idx_created_by` (`created_by`),
  INDEX `idx_updated_by` (`updated_by`),
  FOREIGN KEY `fk_products_category_id` (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_products_created_by` (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_products_updated_by` (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: product_variants
-- Description: Product variant options (e.g., size, color)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `created_by` BIGINT UNSIGNED NULL,
  `updated_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_product_stock` (`product_id`, `stock_quantity`),
  INDEX `idx_created_by` (`created_by`),
  INDEX `idx_updated_by` (`updated_by`),
  FOREIGN KEY `fk_product_variants_product_id` (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_product_variants_created_by` (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_product_variants_updated_by` (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: product_weight_variants
-- Description: Product weight-based variants (e.g., 200g, 500g, 1kg)
-- Primary variant table for pricing and stock management
-- ============================================================================
CREATE TABLE IF NOT EXISTS `product_weight_variants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `weight_value` INT NOT NULL,
  `weight_unit` ENUM('g', 'kg') NOT NULL DEFAULT 'g',
  `price` DECIMAL(10, 2) NOT NULL,
  `promotional_price` DECIMAL(10, 2) NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_by` BIGINT UNSIGNED NULL,
  `updated_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  UNIQUE KEY `unique_product_weight` (`product_id`, `weight_value`, `weight_unit`),
  FOREIGN KEY `fk_weight_variants_product_id` (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_weight_variants_created_by` (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_weight_variants_updated_by` (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: cart_items
-- Description: Shopping cart items (guest and user sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `weight_variant_id` BIGINT UNSIGNED NULL,
  `user_id` BIGINT UNSIGNED NULL,
  `session_id` VARCHAR(255) NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  UNIQUE KEY `cart_item_unique_owner` (`product_id`, `user_id`, `session_id`),
  INDEX `idx_session_id` (`session_id`),
  FOREIGN KEY `fk_cart_items_product_id` (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_cart_items_user_id` (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_cart_items_weight_variant_id` (`weight_variant_id`) REFERENCES `product_weight_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: delivery_fees
-- Description: Delivery fee configuration and tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS `delivery_fees` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `delivery_person_name` VARCHAR(100) NOT NULL,
  `delivery_person_phone` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
  `is_active` BOOLEAN NOT NULL DEFAULT FALSE,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: orders
-- Description: Customer orders
-- ============================================================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `session_id` VARCHAR(100) NULL,
  `reference` VARCHAR(20) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `country` VARCHAR(120) NOT NULL,
  `region` VARCHAR(120) NOT NULL,
  `city` VARCHAR(120) NOT NULL,
  `postal_code` VARCHAR(10) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `note` VARCHAR(255) NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `delivery_fees_id` BIGINT UNSIGNED NULL,
  `items_count` INT UNSIGNED NOT NULL,
  `items` JSON NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_session_id` (`session_id`),
  INDEX `idx_user_created` (`user_id`, `created_at`),
  FOREIGN KEY `fk_orders_user_id` (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY `fk_orders_delivery_fees_id` (`delivery_fees_id`) REFERENCES `delivery_fees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: order_status_history
-- Description: Audit trail of order status changes
-- ============================================================================
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `old_status` VARCHAR(255) NULL,
  `new_status` VARCHAR(255) NOT NULL,
  `changed_by` BIGINT UNSIGNED NULL,
  `note` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_order_created` (`order_id`, `created_at`),
  FOREIGN KEY `fk_order_status_history_order_id` (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_order_status_history_changed_by` (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: invoices
-- Description: Invoice generation and tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(255) NOT NULL UNIQUE,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NULL,

  -- Seller information
  `seller_name` VARCHAR(255) NOT NULL,
  `seller_address` TEXT NOT NULL,
  `seller_registration` VARCHAR(255) NULL,
  `seller_vat_number` VARCHAR(255) NULL,

  -- Client information
  `client_name` VARCHAR(255) NOT NULL,
  `client_email` VARCHAR(255) NOT NULL,
  `client_phone` VARCHAR(255) NOT NULL,
  `client_address` TEXT NOT NULL,

  -- Financial information
  `subtotal_ht` DECIMAL(10, 2) NOT NULL,
  `vat_rate` DECIMAL(5, 2) NOT NULL DEFAULT 19.00,
  `vat_amount` DECIMAL(10, 2) NOT NULL,
  `total_ttc` DECIMAL(10, 2) NOT NULL,

  -- Payment information
  `payment_method` VARCHAR(255) NOT NULL DEFAULT 'cash_on_delivery',
  `payment_status` VARCHAR(255) NOT NULL DEFAULT 'pending',

  -- Invoice metadata
  `invoice_date` DATE NOT NULL,
  `due_date` DATE NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'draft',

  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_invoice_created` (`invoice_number`, `created_at`),
  INDEX `idx_user_status` (`user_id`, `status`),
  FOREIGN KEY `fk_invoices_order_id` (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY `fk_invoices_user_id` (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: notifications
-- Description: Polymorphic notifications for users
-- ============================================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `type` VARCHAR(255) NOT NULL,
  `notifiable_type` VARCHAR(255) NOT NULL,
  `notifiable_id` BIGINT UNSIGNED NOT NULL,
  `data` TEXT NOT NULL,
  `read_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,

  INDEX `idx_notifiable` (`notifiable_type`, `notifiable_id`),
  INDEX `idx_read_at` (`read_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: site_settings
-- Description: Global site configuration and branding
-- ============================================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(255) NOT NULL DEFAULT 'Bsissa',
  `logo` VARCHAR(255) NULL,
  `contact_email` VARCHAR(255) NULL,
  `contact_phone` VARCHAR(255) NULL,
  `physical_address` TEXT NULL,
  `facebook_url` VARCHAR(255) NULL,
  `instagram_url` VARCHAR(255) NULL,
  `twitter_url` VARCHAR(255) NULL,
  `linkedin_url` VARCHAR(255) NULL,
  `youtube_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Add foreign key constraints for sessions table
-- ============================================================================
ALTER TABLE `sessions`
ADD CONSTRAINT `fk_sessions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS=1;
