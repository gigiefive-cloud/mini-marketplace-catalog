const pool = require('../config/db');

// GET /api/products
// Mendukung query: ?search=&category_id=&min_price=&max_price=
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category_id, min_price, max_price } = req.query;

    let query = `
      SELECT p.product_id, p.product_name, p.description, p.price, p.stock,
             p.image_url, p.created_at, c.category_id, c.category_name
      FROM product p
      JOIN product_category c ON p.category_id = c.category_id
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      query += ` AND p.product_name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    if (min_price) {
      query += ` AND p.price >= ?`;
      params.push(min_price);
    }

    if (max_price) {
      query += ` AND p.price <= ?`;
      params.push(max_price);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(query, params);
    res.status(200).json({ success: true, total: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk', error: error.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.product_id, p.product_name, p.description, p.price, p.stock,
              p.image_url, p.created_at, c.category_id, c.category_name
       FROM product p
       JOIN product_category c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail produk', error: error.message });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, stock, image_url } = req.body;

    if (!category_id || !product_name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'category_id, product_name, dan price wajib diisi',
      });
    }

    const [kategori] = await pool.query(`SELECT category_id FROM product_category WHERE category_id = ?`, [category_id]);
    if (kategori.length === 0) {
      return res.status(400).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    const [result] = await pool.query(
      `INSERT INTO product (category_id, product_name, description, price, stock, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id, product_name.trim(), description || null, price, stock || 0, image_url || null]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: { product_id: result.insertId, category_id, product_name, description, price, stock, image_url },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk', error: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, product_name, description, price, stock, image_url } = req.body;

    if (!category_id || !product_name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'category_id, product_name, dan price wajib diisi',
      });
    }

    const [result] = await pool.query(
      `UPDATE product
       SET category_id = ?, product_name = ?, description = ?, price = ?, stock = ?, image_url = ?
       WHERE product_id = ?`,
      [category_id, product_name.trim(), description || null, price, stock || 0, image_url || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Produk berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui produk', error: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM product WHERE product_id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus produk', error: error.message });
  }
};
