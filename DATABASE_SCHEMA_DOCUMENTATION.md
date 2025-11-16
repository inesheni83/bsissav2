# Bsissa Database Schema Documentation

Complete database schema analysis from Laravel migrations. This document provides detailed information about all tables, columns, relationships, indexes, and constraints.

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Session Tables](#authentication--session-tables)
3. [Product Management](#product-management)
4. [Shopping & Orders](#shopping--orders)
5. [Financial & Invoicing](#financial--invoicing)
6. [Notifications & Settings](#notifications--settings)
7. [Relationships Map](#relationships-map)
8. [Indexes Summary](#indexes-summary)
9. [Data Integrity Notes](#data-integrity-notes)

---

## Overview

### Key Statistics
- **Total Tables**: 18
- **Total Columns**: 200+
- **Foreign Keys**: 30+
- **Unique Constraints**: 10+
- **Indexes**: 40+

### Database Engine
- **Engine**: InnoDB
- **Charset**: utf8mb4_unicode_ci
- **Features**: Foreign key constraints, cascading deletes, transaction support

---

## Authentication & Session Tables

### TABLE: users
**Description**: Core user accounts and authentication data
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | NO | | | User full name |
| email | VARCHAR(255) | NO | UQ | | Unique email |
| phone | VARCHAR(255) | YES | | NULL | Contact phone number |
| address_line1 | VARCHAR(255) | YES | | NULL | First address line |
| address_line2 | VARCHAR(255) | YES | | NULL | Second address line (apt, suite) |
| city | VARCHAR(255) | YES | | NULL | City name |
| state | VARCHAR(255) | YES | | NULL | State/Province |
| postal_code | VARCHAR(255) | YES | | NULL | Postal/ZIP code |
| country | VARCHAR(255) | NO | | 'Tunisie' | Country (default: Tunisia) |
| email_verified_at | TIMESTAMP | YES | | NULL | Email verification timestamp |
| password | VARCHAR(255) | NO | | | Hashed password |
| two_factor_secret | TEXT | YES | | NULL | TOTP secret for 2FA |
| two_factor_recovery_codes | TEXT | YES | | NULL | JSON-encoded recovery codes |
| two_factor_confirmed_at | TIMESTAMP | YES | | NULL | 2FA confirmation timestamp |
| role | ENUM | NO | | 'client' | User role: admin, vendeur, client |
| remember_token | VARCHAR(100) | YES | | NULL | Remember me token |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `email`
- INDEX: `role`

**Foreign Keys**: None (referenced by many tables)

---

### TABLE: password_reset_tokens
**Description**: Temporary password reset tokens
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| email | VARCHAR(255) | NO | PK | | User email |
| token | VARCHAR(255) | NO | | | Reset token hash |
| created_at | TIMESTAMP | YES | | NULL | Token creation time |

**Indexes**:
- PRIMARY KEY: `email`

---

### TABLE: sessions
**Description**: User session management and tracking
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | VARCHAR(255) | NO | PK | | Session identifier |
| user_id | BIGINT UNSIGNED | YES | FK | NULL | Associated user (nullable for guests) |
| ip_address | VARCHAR(45) | YES | | NULL | Client IP address |
| user_agent | TEXT | YES | | NULL | Browser user agent |
| payload | LONGTEXT | NO | | | Serialized session data |
| last_activity | INT | NO | | | Unix timestamp of last activity |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `last_activity`

**Foreign Keys**:
- `user_id` -> `users.id` (ON DELETE CASCADE)

---

### TABLE: cache
**Description**: Laravel cache storage
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| key | VARCHAR(255) | NO | PK | | Cache key |
| value | MEDIUMTEXT | NO | | | Cached value |
| expiration | INT | NO | | | Unix expiration timestamp |

**Indexes**:
- PRIMARY KEY: `key`
- INDEX: `expiration`

---

### TABLE: cache_locks
**Description**: Distributed cache locks
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| key | VARCHAR(255) | NO | PK | | Lock key |
| owner | VARCHAR(255) | NO | | | Lock owner identifier |
| expiration | INT | NO | | | Lock expiration timestamp |

**Indexes**:
- PRIMARY KEY: `key`
- INDEX: `expiration`

---

## Product Management

### TABLE: categories
**Description**: Product category taxonomy
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | NO | | | Category name |
| slug | VARCHAR(255) | NO | UQ | | URL-friendly slug |
| description | TEXT | YES | | NULL | Category description |
| created_by | BIGINT UNSIGNED | YES | FK | NULL | Creator user ID |
| updated_by | BIGINT UNSIGNED | YES | FK | NULL | Last updater user ID |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- INDEX: `created_by`
- INDEX: `updated_by`

**Foreign Keys**:
- `created_by` -> `users.id` (ON DELETE SET NULL)
- `updated_by` -> `users.id` (ON DELETE SET NULL)

---

### TABLE: products
**Description**: Main product catalog
**Engine**: InnoDB
**Timestamps**: created_at, updated_at
**Important**: After migrations, price and stock_quantity moved to product_weight_variants

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | NO | | | Product name |
| slug | VARCHAR(255) | NO | UQ | | URL-friendly slug |
| description | TEXT | YES | | NULL | Short description |
| detailed_description | TEXT | YES | | NULL | Long-form description |
| image | VARCHAR(255) | YES | | NULL | Primary image path |
| category_id | BIGINT UNSIGNED | YES | FK | NULL | Category reference |
| is_featured | BOOLEAN | NO | | FALSE | Featured product flag |
| ingredients | TEXT | YES | | NULL | Product ingredients list |
| marketing_tags | VARCHAR(500) | YES | | NULL | Marketing tags |
| calories_kcal | DECIMAL(6,1) | YES | | NULL | Calories per 100g |
| protein_g | DECIMAL(5,1) | YES | | NULL | Protein per 100g |
| carbs_g | DECIMAL(5,1) | YES | | NULL | Carbohydrates per 100g |
| fat_g | DECIMAL(5,1) | YES | | NULL | Fat per 100g |
| fiber_g | DECIMAL(5,1) | YES | | NULL | Fiber per 100g |
| created_by | BIGINT UNSIGNED | YES | FK | NULL | Creator user ID |
| updated_by | BIGINT UNSIGNED | YES | FK | NULL | Last updater user ID |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `slug`
- INDEX: `name, description` (full-text search)
- INDEX: `category_id`
- INDEX: `is_featured`
- INDEX: `created_at`
- INDEX: `category_id, is_featured` (composite for filtering)
- INDEX: `created_by`
- INDEX: `updated_by`

**Foreign Keys**:
- `category_id` -> `categories.id` (ON DELETE SET NULL)
- `created_by` -> `users.id` (ON DELETE SET NULL)
- `updated_by` -> `users.id` (ON DELETE SET NULL)

---

### TABLE: product_variants
**Description**: Product variant options (color, size, etc.)
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| product_id | BIGINT UNSIGNED | NO | FK | | Parent product |
| name | VARCHAR(255) | NO | | | Variant name (e.g., "Red", "Size M") |
| price | DECIMAL(10,2) | NO | | | Variant-specific price |
| stock_quantity | INT | NO | | 0 | Available stock |
| created_by | BIGINT UNSIGNED | YES | FK | NULL | Creator user ID |
| updated_by | BIGINT UNSIGNED | YES | FK | NULL | Last updater user ID |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `product_id, stock_quantity` (composite)
- INDEX: `created_by`
- INDEX: `updated_by`

**Foreign Keys**:
- `product_id` -> `products.id` (ON DELETE CASCADE)
- `created_by` -> `users.id` (ON DELETE SET NULL)
- `updated_by` -> `users.id` (ON DELETE SET NULL)

---

### TABLE: product_weight_variants
**Description**: Weight-based product variants (primary pricing/stock table)
**Engine**: InnoDB
**Timestamps**: created_at, updated_at
**Important**: This is the primary table for pricing, promotional prices, and stock management

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| product_id | BIGINT UNSIGNED | NO | FK | | Parent product |
| weight_value | INT | NO | | | Weight amount (numeric only) |
| weight_unit | ENUM | NO | | 'g' | Unit: 'g' (grams) or 'kg' (kilograms) |
| price | DECIMAL(10,2) | NO | | | Regular price |
| promotional_price | DECIMAL(10,2) | YES | | NULL | Promotional/discount price |
| stock_quantity | INT | NO | | 0 | Available stock |
| is_available | BOOLEAN | NO | | TRUE | Availability flag |
| created_by | BIGINT UNSIGNED | YES | FK | NULL | Creator user ID |
| updated_by | BIGINT UNSIGNED | YES | FK | NULL | Last updater user ID |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `product_id, weight_value, weight_unit` (unique_product_weight)

**Foreign Keys**:
- `product_id` -> `products.id` (ON DELETE CASCADE)
- `created_by` -> `users.id` (ON DELETE SET NULL)
- `updated_by` -> `users.id` (ON DELETE SET NULL)

---

## Shopping & Orders

### TABLE: cart_items
**Description**: Shopping cart items for authenticated and guest users
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| product_id | BIGINT UNSIGNED | NO | FK | | Referenced product |
| weight_variant_id | BIGINT UNSIGNED | YES | FK | NULL | Product weight variant |
| user_id | BIGINT UNSIGNED | YES | FK | NULL | Authenticated user (NULL for guests) |
| session_id | VARCHAR(255) | YES | | NULL | Guest session identifier |
| quantity | INT UNSIGNED | NO | | | Item quantity |
| unit_price | DECIMAL(10,2) | NO | | | Price per unit |
| total_price | DECIMAL(10,2) | NO | | | Quantity * unit_price |
| created_at | TIMESTAMP | YES | | NULL | Added to cart time |
| updated_at | TIMESTAMP | YES | | NULL | Last modification time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `product_id, user_id, session_id` (cart_item_unique_owner)
- INDEX: `session_id`

**Foreign Keys**:
- `product_id` -> `products.id` (ON DELETE CASCADE)
- `user_id` -> `users.id` (ON DELETE CASCADE)
- `weight_variant_id` -> `product_weight_variants.id` (ON DELETE CASCADE)

---

### TABLE: orders
**Description**: Customer purchase orders
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| user_id | BIGINT UNSIGNED | YES | FK | NULL | Customer (NULL for guest orders) |
| session_id | VARCHAR(100) | YES | | NULL | Guest session tracking |
| reference | VARCHAR(20) | NO | UQ | | Order reference/number |
| first_name | VARCHAR(100) | NO | | | Delivery recipient first name |
| last_name | VARCHAR(100) | NO | | | Delivery recipient last name |
| address | VARCHAR(255) | NO | | | Delivery street address |
| country | VARCHAR(120) | NO | | | Delivery country |
| region | VARCHAR(120) | NO | | | Delivery region/governorate |
| city | VARCHAR(120) | NO | | | Delivery city |
| postal_code | VARCHAR(10) | NO | | | Delivery postal code |
| phone | VARCHAR(20) | NO | | | Delivery contact phone |
| note | VARCHAR(255) | YES | | NULL | Delivery notes/special instructions |
| subtotal | DECIMAL(10,2) | NO | | | Order subtotal (before fees) |
| delivery_fees_id | BIGINT UNSIGNED | YES | FK | NULL | Associated delivery fee |
| items_count | INT UNSIGNED | NO | | | Total items in order |
| items | JSON | NO | | | Order items snapshot (JSON) |
| status | VARCHAR(20) | NO | | 'pending' | Order status |
| created_at | TIMESTAMP | YES | | NULL | Order creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `reference`
- INDEX: `session_id`
- INDEX: `user_id, created_at` (composite)

**Foreign Keys**:
- `user_id` -> `users.id` (ON DELETE SET NULL)
- `delivery_fees_id` -> `delivery_fees.id` (ON DELETE SET NULL)

---

### TABLE: delivery_fees
**Description**: Delivery fee configuration and tracking
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| delivery_person_name | VARCHAR(100) | NO | | | Delivery personnel name |
| delivery_person_phone | VARCHAR(20) | NO | | | Delivery personnel phone |
| amount | DECIMAL(10,2) | NO | | | Delivery fee amount |
| status | ENUM | NO | | 'pending' | Status: pending, paid, cancelled |
| is_active | BOOLEAN | NO | | FALSE | Active delivery fee flag |
| notes | TEXT | YES | | NULL | Additional notes |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`

---

## Financial & Invoicing

### TABLE: invoices
**Description**: Invoice generation and financial tracking
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| invoice_number | VARCHAR(255) | NO | UQ | | Unique invoice identifier |
| order_id | BIGINT UNSIGNED | NO | FK | | Associated order |
| user_id | BIGINT UNSIGNED | YES | FK | NULL | Customer (nullable) |
| seller_name | VARCHAR(255) | NO | | | Business name |
| seller_address | TEXT | NO | | | Business address |
| seller_registration | VARCHAR(255) | YES | | NULL | Business registration number |
| seller_vat_number | VARCHAR(255) | YES | | NULL | VAT/Tax registration number |
| client_name | VARCHAR(255) | NO | | | Customer full name |
| client_email | VARCHAR(255) | NO | | | Customer email |
| client_phone | VARCHAR(255) | NO | | | Customer phone |
| client_address | TEXT | NO | | | Customer address |
| subtotal_ht | DECIMAL(10,2) | NO | | | Subtotal before tax |
| vat_rate | DECIMAL(5,2) | NO | | 19.00 | VAT percentage |
| vat_amount | DECIMAL(10,2) | NO | | | Calculated VAT amount |
| total_ttc | DECIMAL(10,2) | NO | | | Total with tax (TTC) |
| payment_method | VARCHAR(255) | NO | | 'cash_on_delivery' | Payment method |
| payment_status | VARCHAR(255) | NO | | 'pending' | Payment status |
| invoice_date | DATE | NO | | | Invoice issue date |
| due_date | DATE | YES | | NULL | Payment due date |
| notes | TEXT | YES | | NULL | Invoice notes |
| status | VARCHAR(255) | NO | | 'draft' | Invoice status: draft, sent, paid, cancelled |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `invoice_number`
- INDEX: `invoice_number, created_at` (composite)
- INDEX: `user_id, status` (composite)

**Foreign Keys**:
- `order_id` -> `orders.id` (ON DELETE CASCADE)
- `user_id` -> `users.id` (ON DELETE SET NULL)

---

### TABLE: order_status_history
**Description**: Audit trail for order status changes
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| order_id | BIGINT UNSIGNED | NO | FK | | Associated order |
| old_status | VARCHAR(255) | YES | | NULL | Previous status |
| new_status | VARCHAR(255) | NO | | | Updated status |
| changed_by | BIGINT UNSIGNED | YES | FK | NULL | User who made the change |
| note | TEXT | YES | | NULL | Change reason/notes |
| created_at | TIMESTAMP | YES | | NULL | Change timestamp |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `order_id, created_at` (composite)

**Foreign Keys**:
- `order_id` -> `orders.id` (ON DELETE CASCADE)
- `changed_by` -> `users.id` (ON DELETE SET NULL)

---

## Notifications & Settings

### TABLE: notifications
**Description**: Polymorphic notification system
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | CHAR(36) | NO | PK | | UUID primary key |
| type | VARCHAR(255) | NO | | | Notification type class |
| notifiable_type | VARCHAR(255) | NO | | | Polymorphic model type |
| notifiable_id | BIGINT UNSIGNED | NO | | | Polymorphic model ID |
| data | TEXT | NO | | | JSON notification data |
| read_at | TIMESTAMP | YES | | NULL | Read timestamp (NULL if unread) |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `notifiable_type, notifiable_id` (polymorphic lookup)
- INDEX: `read_at`

---

### TABLE: site_settings
**Description**: Global site configuration and branding
**Engine**: InnoDB
**Timestamps**: created_at, updated_at

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| site_name | VARCHAR(255) | NO | | 'Bsissa' | Website name |
| logo | VARCHAR(255) | YES | | NULL | Logo image path |
| contact_email | VARCHAR(255) | YES | | NULL | Contact email address |
| contact_phone | VARCHAR(255) | YES | | NULL | Contact phone number |
| physical_address | TEXT | YES | | NULL | Business physical address |
| facebook_url | VARCHAR(255) | YES | | NULL | Facebook profile URL |
| instagram_url | VARCHAR(255) | YES | | NULL | Instagram profile URL |
| twitter_url | VARCHAR(255) | YES | | NULL | Twitter profile URL |
| linkedin_url | VARCHAR(255) | YES | | NULL | LinkedIn profile URL |
| youtube_url | VARCHAR(255) | YES | | NULL | YouTube channel URL |
| created_at | TIMESTAMP | YES | | NULL | Record creation time |
| updated_at | TIMESTAMP | YES | | NULL | Last update time |

**Indexes**:
- PRIMARY KEY: `id`

---

## Background Processing Tables

### TABLE: jobs
**Description**: Background job queue entries
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| queue | VARCHAR(255) | NO | | | Queue name |
| payload | LONGTEXT | NO | | | Serialized job data |
| attempts | TINYINT UNSIGNED | NO | | | Execution attempts |
| reserved_at | INT UNSIGNED | YES | | NULL | Reservation timestamp |
| available_at | INT UNSIGNED | NO | | | Available execution time |
| created_at | INT UNSIGNED | NO | | | Job creation time |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `queue`

---

### TABLE: job_batches
**Description**: Job batch tracking
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | VARCHAR(255) | NO | PK | | Batch identifier |
| name | VARCHAR(255) | NO | | | Batch name |
| total_jobs | INT | NO | | | Total jobs in batch |
| pending_jobs | INT | NO | | | Pending job count |
| failed_jobs | INT | NO | | | Failed job count |
| failed_job_ids | LONGTEXT | NO | | | JSON-encoded failed IDs |
| options | MEDIUMTEXT | YES | | NULL | Batch options |
| cancelled_at | INT | YES | | NULL | Cancellation timestamp |
| created_at | INT | NO | | | Batch creation time |
| finished_at | INT | YES | | NULL | Batch completion time |

**Indexes**:
- PRIMARY KEY: `id`

---

### TABLE: failed_jobs
**Description**: Failed job logging
**Engine**: InnoDB

| Column | Type | Null | Key | Default | Notes |
|--------|------|------|-----|---------|-------|
| id | BIGINT UNSIGNED | NO | PK | AUTO_INCREMENT | Primary key |
| uuid | VARCHAR(255) | NO | UQ | | Unique failure identifier |
| connection | TEXT | NO | | | Queue connection |
| queue | TEXT | NO | | | Queue name |
| payload | LONGTEXT | NO | | | Job payload |
| exception | LONGTEXT | NO | | | Exception message/stack |
| failed_at | TIMESTAMP | NO | | CURRENT_TIMESTAMP | Failure timestamp |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `uuid`

---

## Relationships Map

### User-Related Relationships
```
users
├── 1:N -> sessions (user_id)
├── 1:N -> orders (user_id)
├── 1:N -> cart_items (user_id)
├── 1:N -> invoices (user_id)
├── 1:N -> created products (created_by)
├── 1:N -> updated products (updated_by)
├── 1:N -> created categories (created_by)
├── 1:N -> updated categories (updated_by)
├── 1:N -> created product_variants (created_by)
├── 1:N -> updated product_variants (updated_by)
├── 1:N -> created product_weight_variants (created_by)
├── 1:N -> updated product_weight_variants (updated_by)
└── 1:N -> order_status_history (changed_by)
```

### Product-Related Relationships
```
products
├── N:1 -> categories (category_id)
├── 1:N -> product_variants (product_id)
├── 1:N -> product_weight_variants (product_id)
└── 1:N -> cart_items (product_id)

categories
├── 1:N -> products (category_id)
```

### Order-Related Relationships
```
orders
├── N:1 -> users (user_id)
├── N:1 -> delivery_fees (delivery_fees_id)
├── 1:N -> order_status_history (order_id)
└── 1:N -> invoices (order_id)

order_status_history
├── N:1 -> orders (order_id)
└── N:1 -> users (changed_by)

invoices
├── N:1 -> orders (order_id)
└── N:1 -> users (user_id)
```

### Cart Relationships
```
cart_items
├── N:1 -> products (product_id)
├── N:1 -> users (user_id)
└── N:1 -> product_weight_variants (weight_variant_id)
```

---

## Indexes Summary

### Unique Indexes (Preventing Duplicates)
| Table | Columns | Name |
|-------|---------|------|
| users | email | email |
| categories | slug | slug |
| products | slug | slug |
| product_weight_variants | product_id, weight_value, weight_unit | unique_product_weight |
| cart_items | product_id, user_id, session_id | cart_item_unique_owner |
| orders | reference | reference |
| invoices | invoice_number | invoice_number |
| failed_jobs | uuid | uuid |

### Performance Indexes (Query Optimization)

**Search & Filtering**:
- products: (name, description)
- categories: (slug)
- products: (slug)

**Foreign Key Indexes**:
- products: (category_id)
- product_variants: (product_id)
- product_weight_variants: (product_id)
- cart_items: (session_id)
- sessions: (user_id)
- orders: (user_id, created_at)
- invoices: (user_id, status)

**Status & Availability Indexes**:
- products: (is_featured)
- products: (category_id, is_featured) - composite
- products: (created_at)
- delivery_fees: (status)

**Audit Trail Indexes**:
- order_status_history: (order_id, created_at)
- invoices: (invoice_number, created_at)
- notifications: (notifiable_type, notifiable_id)
- notifications: (read_at)

---

## Data Integrity Notes

### Cascading Deletes
When a parent record is deleted, child records are automatically deleted:
- products -> cart_items
- products -> product_weight_variants
- product_weight_variants -> cart_items
- orders -> order_status_history
- orders -> invoices
- categories -> products (via SET NULL, not cascading)
- product_variants -> (no children)

### Set NULL Behavior
When referenced records are deleted, the foreign key is set to NULL:
- categories.category_id -> products
- products.created_by, updated_by
- product_variants.created_by, updated_by
- product_weight_variants.created_by, updated_by
- orders.user_id
- orders.delivery_fees_id
- invoices.user_id
- order_status_history.changed_by

### Unique Constraints
Prevent duplicate entries for:
- User emails (authentication uniqueness)
- Product slugs (URL routing)
- Category slugs (URL routing)
- Weight variant combinations (no duplicate weight options per product)
- Cart items (one item per product per user/session)
- Order references (order tracking)
- Invoice numbers (financial auditing)
- Failed job UUIDs (job tracking)

### Transaction Support
All tables use InnoDB engine, ensuring:
- ACID compliance
- Transaction rollback capability
- Deadlock detection
- Foreign key constraint enforcement

### Default Values
| Table | Column | Default | Purpose |
|-------|--------|---------|---------|
| users | role | 'client' | Default user role |
| users | country | 'Tunisie' | Default country for Tunisia-based app |
| products | is_featured | FALSE | Not featured by default |
| product_variants | stock_quantity | 0 | Default no stock |
| product_weight_variants | weight_unit | 'g' | Default unit to grams |
| product_weight_variants | stock_quantity | 0 | Default no stock |
| product_weight_variants | is_available | TRUE | Available by default |
| orders | status | 'pending' | Initial order status |
| delivery_fees | status | 'pending' | Initial delivery status |
| delivery_fees | is_active | FALSE | Inactive by default |
| invoices | vat_rate | 19.00 | Tunisia VAT standard rate |
| invoices | payment_method | 'cash_on_delivery' | Default payment method |
| invoices | payment_status | 'pending' | Initial payment status |
| invoices | status | 'draft' | Initial invoice status |
| site_settings | site_name | 'Bsissa' | Default site name |

### Timestamps
All application tables include:
- `created_at` - Record creation timestamp (immutable)
- `updated_at` - Last modification timestamp (updated on every change)

Exception: Background processing tables (jobs, job_batches, failed_jobs) use integer Unix timestamps instead of TIMESTAMP fields.

---

## Database Configuration

### Connection Details
- **Driver**: MySQL
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB (all tables)
- **Foreign Key Checks**: Enabled

### Performance Considerations

1. **Search Optimization**:
   - Full-text indexes on product name and description
   - Slug indexes for URL-based lookups
   - Composite indexes for common filter combinations

2. **Reporting Queries**:
   - Order/invoice queries indexed by user_id and status
   - Order status history indexed by order_id and date
   - Notifications indexed by polymorphic type/id pair

3. **Session Management**:
   - Session expiration indexed for cleanup queries
   - Cache expiration indexed for garbage collection

4. **Stock Management**:
   - Weight variant availability tracked separately
   - Stock quantities indexed for low-stock queries
   - Composite indexes for stock filtering

---

## Migration Timeline

| Date | Migration | Description |
|------|-----------|-------------|
| 2025-01-01 | 0001_01_01_000000 | Initial users, password_reset_tokens, sessions tables |
| 2025-01-01 | 0001_01_01_000001 | Cache tables for Laravel caching |
| 2025-01-01 | 0001_01_01_000002 | Job queue tables for background processing |
| 2024-03-17 | 2024_03_17_000000 | Cart items table |
| 2025-08-26 | 2025_08_26_100418 | Two-factor authentication columns |
| 2025-09-25 | 2025_09_25_201600 | Categories table |
| 2025-09-25 | 2025_09_25_201615 | Products table (initial) |
| 2025-09-25 | 2025_09_25_201626 | Product variants table |
| 2025-10-04 | 2025_10_04_122200 | User tracking columns (created_by, updated_by) |
| 2025-10-04 | 2025_10_04_130000 | Initial performance indexes |
| 2025-10-16 | 2025_10_16_130000 | Search index optimization |
| 2025-10-19 | 2025_10_19_120000 | Orders table |
| 2025-10-24 | 2025_10_24_180444 | Product nutrition info fields |
| 2025-11-06 | 2025_11_06_153100 | Promotional pricing |
| 2025-11-07 | 2025_11_07_113602 | Order status history audit table |
| 2025-11-07 | 2025_11_07_114532 | Polymorphic notifications table |
| 2025-11-07 | 2025_11_07_172836 | Invoices table |
| 2025-11-09 | 2025_11_09_153314 | Product weight variants (main table) |
| 2025-11-09 | 2025_11_09_165901 | Move pricing/stock to weight variants |
| 2025-11-09 | 2025_11_09_210211 | Add weight variant tracking to cart |
| 2025-11-09 | 2025_11_09_214925 | Change weight_value to integer |
| 2025-11-09 | 2025_11_09_220024 | Detailed product description |
| 2025-11-10 | 2025_11_10_181543 | Order delivery notes |
| 2025-11-10 | 2025_11_10_194252 | Remove cart item notes |
| 2025-11-11 | 2025_11_11_081417 | Delivery fees configuration |
| 2025-11-11 | 2025_11_11_090458 | Simplify delivery fees structure |
| 2025-11-11 | 2025_11_11_091456 | Active status for delivery fees |
| 2025-11-11 | 2025_11_11_141311 | Link delivery fees to orders |
| 2025-11-14 | 2025_11_14_062327 | Site settings and branding |
| 2025-11-14 | 2025_11_14_113243 | User address fields |

---

## Recommended Queries

### Common Reports

**Get featured products with stock availability**:
```sql
SELECT p.*, pwv.price, pwv.promotional_price, pwv.stock_quantity
FROM products p
LEFT JOIN product_weight_variants pwv ON p.id = pwv.product_id
WHERE p.is_featured = TRUE AND pwv.is_available = TRUE
ORDER BY p.created_at DESC;
```

**Monthly sales report**:
```sql
SELECT
    DATE_FORMAT(o.created_at, '%Y-%m') as month,
    COUNT(o.id) as total_orders,
    SUM(o.subtotal) as total_sales,
    AVG(o.subtotal) as avg_order_value
FROM orders o
WHERE o.status != 'cancelled'
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY month DESC;
```

**Low stock alerts**:
```sql
SELECT p.name, pwv.weight_value, pwv.weight_unit, pwv.stock_quantity
FROM product_weight_variants pwv
JOIN products p ON pwv.product_id = p.id
WHERE pwv.stock_quantity < 10
AND pwv.is_available = TRUE
ORDER BY pwv.stock_quantity ASC;
```

**Customer order history**:
```sql
SELECT o.*, COUNT(osh.id) as status_changes
FROM orders o
LEFT JOIN order_status_history osh ON o.id = osh.order_id
WHERE o.user_id = ?
GROUP BY o.id
ORDER BY o.created_at DESC;
```

---

## Backup & Recovery

### Critical Tables (Highest Priority)
1. users
2. orders
3. invoices
4. products
5. product_weight_variants

### Medium Priority
1. cart_items
2. categories
3. order_status_history
4. delivery_fees

### Low Priority (Can be regenerated)
1. cache, cache_locks
2. sessions
3. notifications
4. job queue tables

---

## Notes for Database Administrators

1. **Character Set**: All text fields use utf8mb4 for full UTF-8 support including emojis
2. **Decimal Precision**: Financial fields use DECIMAL(10,2) for accurate currency storage
3. **Timestamps**: All user-facing timestamps use TIMESTAMP (auto timezone handling)
4. **Foreign Keys**: Enabled globally; referential integrity enforced at database level
5. **Regular Maintenance**: Run OPTIMIZE TABLE and UPDATE statistics regularly on large tables
6. **Backup Strategy**: Daily incremental backups, weekly full backups minimum
7. **Growth Monitoring**: Monitor table sizes, especially orders and cart_items which grow continuously

