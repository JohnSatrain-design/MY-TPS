CREATE DATABASE IF NOT EXISTS tps_db;
USE tps_db;

CREATE TABLE users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customers (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NULL,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(50) NULL,
  address TEXT NULL,
  city VARCHAR(50) NULL,
  state VARCHAR(50) NULL,
  postal_code VARCHAR(20) NULL,
  points INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_customers_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uk_customers_user_id (user_id),
  KEY idx_customers_name (name),
  KEY idx_customers_contact (contact),
  KEY idx_customers_city_state (city, state),
  KEY idx_customers_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  image VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_products_name (name),
  KEY idx_products_active_stock (is_active, stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transactions (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  customer_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  payment_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  change_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_transactions_customer_created (customer_id, created_at),
  KEY idx_transactions_status_created (status, created_at),
  KEY idx_transactions_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transaction_items (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  price DECIMAL(12, 2) NOT NULL,
  line_total DECIMAL(12, 2) AS (quantity * price) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_items_transaction
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  CONSTRAINT fk_transaction_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  KEY idx_transaction_items_transaction (transaction_id),
  KEY idx_transaction_items_product (product_id),
  KEY idx_transaction_items_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE logs (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNSIGNED NULL,
  action TEXT NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_logs_user_created (user_id, created_at),
  KEY idx_logs_entity (entity_type, entity_id),
  KEY idx_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@tps.com', '$2a$12$0GP/zECzITdT7DUPaovjX.iNYdljC3Bjt.J7h99BZgbaFoE/W93Sa', 'admin'),
('Staff Member', 'staff@tps.com', '$2a$12$0GP/zECzITdT7DUPaovjX.iNYdljC3Bjt.J7h99BZgbaFoE/W93Sa', 'staff'),
('John Doe', 'customer1@tps.com', '$2a$12$0GP/zECzITdT7DUPaovjX.iNYdljC3Bjt.J7h99BZgbaFoE/W93Sa', 'customer'),
('Jane Smith', 'customer2@tps.com', '$2a$12$0GP/zECzITdT7DUPaovjX.iNYdljC3Bjt.J7h99BZgbaFoE/W93Sa', 'customer');

INSERT INTO customers (user_id, name, contact, address, city, state, postal_code) VALUES
(3, 'John Doe', '09171234567', '123 Main St', 'Quezon City', 'Metro Manila', '1100'),
(4, 'Jane Smith', '09181234567', '456 Oak Ave', 'Pasig', 'Metro Manila', '1600');

INSERT INTO products (name, price, stock, image, is_active) VALUES
('Iced Latte', 165.00, 40, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80', 1),
('Cold Brew Bottle', 220.00, 24, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', 1),
('Butter Croissant', 95.00, 30, 'https://images.unsplash.com/photo-1555507036-ab794f4ade6a?auto=format&fit=crop&w=800&q=80', 1),
('Blueberry Cheesecake Slice', 185.00, 16, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', 1),
('House Blend Beans 250g', 420.00, 18, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80', 1),
('Sparkling Citrus Tea', 145.00, 28, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80', 1);
