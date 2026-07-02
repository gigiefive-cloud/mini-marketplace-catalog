-- ============================================================
-- Mini Marketplace Catalog - Database Schema
-- Dibangun oleh: Ahmad Regenta (Regie)
--
-- Catatan skala:
-- Skema ini didesain agar bisa berkembang dari katalog produk
-- sederhana menjadi sistem marketplace penuh (user, order,
-- transaksi) tanpa perlu merombak struktur dasar.
--
-- Scope MVP saat ini  : product_category, product
-- Scope pengembangan  : user, order, order_detail (sudah
--                        disiapkan strukturnya, tinggal
--                        diaktifkan endpoint-nya)
-- ============================================================

CREATE TABLE IF NOT EXISTS `user` (
    `user_id`  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email`    VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role`     ENUM('admin', 'seller', 'buyer') NOT NULL DEFAULT 'buyer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MVP TABLES (aktif digunakan di API saat ini)
-- ============================================================

CREATE TABLE IF NOT EXISTS `product_category` (
    `category_id`   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(255) NOT NULL,
    `slug`          VARCHAR(255) NOT NULL UNIQUE,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `product` (
    `product_id`   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_id`  INT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `description`  VARCHAR(500) NULL,
    `price`        DECIMAL(12, 2) NOT NULL,
    `stock`        INT NOT NULL DEFAULT 0,
    `image_url`    VARCHAR(500) NULL,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `product_category_id_foreign`
        FOREIGN KEY (`category_id`) REFERENCES `product_category`(`category_id`)
        ON DELETE RESTRICT
);

-- ============================================================
-- TAHAP PENGEMBANGAN (disiapkan, belum diaktifkan di API)
-- ============================================================

CREATE TABLE IF NOT EXISTS `order` (
    `order_id`    INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL,
    `status`      ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `order_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
);

CREATE TABLE IF NOT EXISTS `order_detail` (
    `order_detail_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_id`   INT NOT NULL,
    `product_id` INT NOT NULL,
    `price`      DECIMAL(12, 2) NOT NULL,
    `quantity`   INT NOT NULL,
    CONSTRAINT `order_detail_order_id_foreign`
        FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`),
    CONSTRAINT `order_detail_product_id_foreign`
        FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);
