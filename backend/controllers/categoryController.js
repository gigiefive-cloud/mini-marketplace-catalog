const pool = require('../config/db');

// Ubah nama kategori menjadi slug sederhana (huruf kecil, spasi jadi strip)
function buatSlug(nama) {
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category_id, category_name, slug, created_at
       FROM product_category
       ORDER BY category_name ASC`
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kategori', error: error.message });
  }
};

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT category_id, category_name, slug, created_at FROM product_category WHERE category_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail kategori', error: error.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name || category_name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    }

    const slug = buatSlug(category_name);

    const [result] = await pool.query(
      `INSERT INTO product_category (category_name, slug) VALUES (?, ?)`,
      [category_name.trim(), slug]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: { category_id: result.insertId, category_name, slug },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Kategori dengan nama ini sudah ada' });
    }
    res.status(500).json({ success: false, message: 'Gagal menambahkan kategori', error: error.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name || category_name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    }

    const slug = buatSlug(category_name);

    const [result] = await pool.query(
      `UPDATE product_category SET category_name = ?, slug = ? WHERE category_id = ?`,
      [category_name.trim(), slug, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Kategori berhasil diperbarui', data: { category_id: id, category_name, slug } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kategori', error: error.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [produkTerkait] = await pool.query(
      `SELECT COUNT(*) AS total FROM product WHERE category_id = ?`,
      [id]
    );

    if (produkTerkait[0].total > 0) {
      return res.status(409).json({
        success: false,
        message: `Kategori tidak bisa dihapus karena masih memiliki ${produkTerkait[0].total} produk terkait`,
      });
    }

    const [result] = await pool.query(`DELETE FROM product_category WHERE category_id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori', error: error.message });
  }
};
