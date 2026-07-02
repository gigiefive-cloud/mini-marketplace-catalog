-- ============================================================
-- Mini Marketplace Catalog - Seed Data
-- ============================================================

INSERT INTO `product_category` (`category_name`, `slug`) VALUES
('Elektronik', 'elektronik'),
('Fashion Pria', 'fashion-pria'),
('Fashion Wanita', 'fashion-wanita'),
('Peralatan Rumah Tangga', 'peralatan-rumah-tangga'),
('Makanan & Minuman', 'makanan-minuman');

INSERT INTO `product` (`category_id`, `product_name`, `description`, `price`, `stock`, `image_url`) VALUES
(1, 'Earphone Bluetooth TWS X10', 'Earphone nirkabel dengan kualitas suara jernih dan baterai tahan lama', 149000.00, 45, NULL),
(1, 'Power Bank 10000mAh', 'Power bank kompak dengan fast charging untuk kebutuhan harian', 179000.00, 60, NULL),
(1, 'Smartwatch Fit Pro', 'Jam tangan pintar dengan fitur monitor detak jantung dan notifikasi', 349000.00, 25, NULL),
(2, 'Kemeja Flanel Kotak-kotak', 'Kemeja flanel bahan katun tebal, nyaman untuk cuaca dingin', 129000.00, 80, NULL),
(2, 'Celana Chino Slim Fit', 'Celana chino dengan potongan slim, cocok untuk kerja maupun santai', 159000.00, 55, NULL),
(3, 'Dress Batik Modern', 'Dress batik dengan motif modern, cocok untuk acara formal', 219000.00, 30, NULL),
(3, 'Blouse Katun Premium', 'Blouse berbahan katun premium yang adem dipakai sehari-hari', 99000.00, 70, NULL),
(4, 'Rice Cooker Mini 1 Liter', 'Rice cooker praktis untuk 1-2 porsi, cocok untuk anak kost', 199000.00, 40, NULL),
(4, 'Setrika Uap Portable', 'Setrika uap ringan dan mudah dibawa untuk perjalanan', 89000.00, 50, NULL),
(5, 'Kopi Robusta Lampung 250gr', 'Biji kopi robusta pilihan langsung dari petani Lampung', 45000.00, 100, NULL),
(5, 'Keripik Singkong Balado', 'Keripik singkong renyah dengan bumbu balado pedas manis', 22000.00, 120, NULL);
