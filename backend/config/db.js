const mysql = require('mysql2/promise');
require('dotenv').config();

// Connection pool ke database MySQL
// Kenapa pool, bukan koneksi tunggal?
// Karena API ini didesain untuk berkembang (scalable) -- pool
// memastikan banyak request bisa ditangani bersamaan tanpa
// membuka/menutup koneksi berulang kali.
// Mendukung dua skema penamaan environment variable:
// - DB_HOST/DB_USER/dst -> untuk development lokal (.env manual)
// - MYSQLHOST/MYSQLUSER/dst -> otomatis disediakan oleh Railway MySQL plugin
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'minimarket_db',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
