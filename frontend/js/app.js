// ============================================================
// Mini Marketplace Catalog — Frontend Logic
// Mengambil data dari API Express (jika aktif), dengan fallback
// ke data contoh lokal supaya tampilan tetap bisa dilihat
// meskipun backend belum dijalankan.
// ============================================================

// Pakai path relatif: otomatis mengikuti domain tempat halaman ini disajikan
// (bekerja baik saat lokal lewat "npm run dev" maupun setelah deploy ke Railway)
const API_BASE_URL = '/api';

const state = {
  allProducts: [],
  activeCategory: '',
  searchTerm: '',
  apiOnline: false,
};

const el = {
  grid: document.getElementById('productGrid'),
  empty: document.getElementById('emptyState'),
  resultCount: document.getElementById('resultCount'),
  apiStatus: document.getElementById('apiStatus'),
  searchInput: document.getElementById('searchInput'),
  categoryChips: document.getElementById('categoryChips'),
};

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

function setApiStatus(online) {
  state.apiOnline = online;
  el.apiStatus.dataset.state = online ? 'online' : 'offline';
  el.apiStatus.innerHTML = online
    ? '<span class="api-status__dot"></span> Terhubung ke API — data live dari database'
    : '<span class="api-status__dot"></span> API belum terhubung — menampilkan data contoh';
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('API merespons dengan error');
    const json = await res.json();
    state.allProducts = json.data;
    setApiStatus(true);
  } catch (err) {
    const res = await fetch('js/products-fallback.json');
    state.allProducts = await res.json();
    setApiStatus(false);
  }

  buildCategoryChips();
  renderProducts();
}

function buildCategoryChips() {
  const kategoriUnik = [
    ...new Map(
      state.allProducts.map((p) => [p.category_id, p.category_name])
    ).entries(),
  ];

  kategoriUnik.forEach(([id, name]) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = id;
    btn.textContent = name;
    btn.addEventListener('click', () => {
      state.activeCategory = String(id);
      updateActiveChip(btn);
      renderProducts();
    });
    el.categoryChips.appendChild(btn);
  });

  const semuaChip = el.categoryChips.querySelector('[data-category=""]');
  semuaChip.addEventListener('click', () => {
    state.activeCategory = '';
    updateActiveChip(semuaChip);
    renderProducts();
  });
}

function updateActiveChip(activeBtn) {
  el.categoryChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
  activeBtn.classList.add('is-active');
}

function getFilteredProducts() {
  return state.allProducts.filter((p) => {
    const cocokKategori = !state.activeCategory || String(p.category_id) === state.activeCategory;
    const cocokPencarian = p.product_name.toLowerCase().includes(state.searchTerm.toLowerCase());
    return cocokKategori && cocokPencarian;
  });
}

function renderProducts() {
  const produk = getFilteredProducts();
  el.grid.innerHTML = '';

  el.resultCount.textContent = `${produk.length} produk ditemukan`;
  el.empty.hidden = produk.length !== 0;

  produk.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const stockClass = p.stock <= 10 ? 'stock-note is-low' : 'stock-note';
    const stockLabel = p.stock <= 10 ? `Sisa ${p.stock}` : `Stok ${p.stock}`;

    card.innerHTML = `
      <span class="product-card__category">${p.category_name}</span>
      <h3 class="product-card__name">${p.product_name}</h3>
      <p class="product-card__desc">${p.description || ''}</p>
      <div class="product-card__footer">
        <span class="price-tag">${formatRupiah(p.price)}</span>
        <span class="${stockClass}">${stockLabel}</span>
      </div>
    `;
    el.grid.appendChild(card);
  });
}

el.searchInput.addEventListener('input', (e) => {
  state.searchTerm = e.target.value;
  renderProducts();
});

loadProducts();
