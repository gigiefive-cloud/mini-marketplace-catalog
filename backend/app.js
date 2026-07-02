const express = require('express');
const cors = require('cors');
const path = require('path');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Info singkat status API (bukan lagi di root, supaya root bisa dipakai frontend)
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mini Marketplace Catalog API sedang berjalan',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
    },
  });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Sajikan frontend statis (HTML/CSS/JS) dari folder ../frontend
// Ini yang membuat backend & frontend jadi satu domain saat deploy
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback: rute selain /api/* diarahkan ke index.html (mendukung refresh di halaman manapun)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 handler khusus untuk endpoint /api yang tidak dikenal
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

module.exports = app;
