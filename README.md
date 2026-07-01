# Mini Marketplace Catalog

Portfolio project — Fullstack Web Development Bootcamp (Dibimbing.id)

Dibuat oleh **Ahmad Regenta (Regie)**

---

## Deskripsi Project

Mini Marketplace Catalog adalah aplikasi katalog produk untuk pelaku usaha kecil, dibangun dengan skema data yang sengaja dibuat sederhana namun **scalable**. MVP saat ini fokus pada pengelolaan **kategori** dan **produk** melalui REST API, dengan struktur database yang sudah menyiapkan tabel `user`, `order`, dan `order_detail` untuk pengembangan fitur transaksi di tahap berikutnya.

Problem yang coba dijawab: pelaku usaha kecil sering kesulitan mengelola katalog produk secara rapi dan terpusat karena masih dilakukan manual. Project ini menunjukkan fondasi API yang bisa langsung dipakai dan dikembangkan tanpa merombak struktur dasarnya.

## Tujuan Pembuatan

- Menerapkan REST API dengan struktur MVC menggunakan Node.js dan Express
- Merancang skema database MySQL yang scalable
- Membangun antarmuka katalog produk dengan pencarian dan filter kategori
- Mendokumentasikan project sebagai bagian dari portfolio Fullstack Web Development

## Tools & Teknologi

| Bagian | Teknologi |
|---|---|
| Backend | Node.js, Express.js |
| Database | MySQL (`mysql2`) |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Tools lain | dotenv, cors |

## Struktur Project

```
mini-marketplace-catalog/
├── backend/
│   ├── config/
│   │   └── db.js                  # Koneksi pool MySQL
│   ├── controllers/
│   │   ├── categoryController.js  # Logika CRUD kategori
│   │   └── productController.js   # Logika CRUD produk
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   ├── database/
│   │   ├── schema.sql             # Struktur tabel (termasuk tahap pengembangan)
│   │   └── seed.sql               # Data contoh
│   ├── app.js                     # Setup Express & middleware
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       └── products-fallback.json # Data contoh jika API belum aktif
└── README.md
```

## Skema Database (ERD ringkas)

```
product_category (1) ───< (N) product

user (1) ───< (N) order (1) ───< (N) order_detail >─── (N) product
```

- `product_category` — daftar kategori produk (aktif digunakan)
- `product` — data produk, terhubung ke kategori (aktif digunakan)
- `user`, `order`, `order_detail` — disiapkan untuk tahap pengembangan fitur transaksi

File lengkap ada di [`backend/database/schema.sql`](backend/database/schema.sql).

## API Endpoints

### Kategori — `/api/categories`

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/categories` | Ambil semua kategori |
| GET | `/api/categories/:id` | Ambil detail satu kategori |
| POST | `/api/categories` | Tambah kategori baru |
| PUT | `/api/categories/:id` | Perbarui kategori |
| DELETE | `/api/categories/:id` | Hapus kategori (ditolak jika masih ada produk terkait) |

### Produk — `/api/products`

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/products` | Ambil semua produk. Mendukung query `?search=&category_id=&min_price=&max_price=` |
| GET | `/api/products/:id` | Ambil detail satu produk |
| POST | `/api/products` | Tambah produk baru |
| PUT | `/api/products/:id` | Perbarui produk |
| DELETE | `/api/products/:id` | Hapus produk |

**Contoh response** `GET /api/products`:

```json
{
  "success": true,
  "total": 11,
  "data": [
    {
      "product_id": 1,
      "product_name": "Earphone Bluetooth TWS X10",
      "description": "Earphone nirkabel dengan kualitas suara jernih dan baterai tahan lama",
      "price": "149000.00",
      "stock": 45,
      "category_id": 1,
      "category_name": "Elektronik"
    }
  ]
}
```

## Alur Pengerjaan

1. Merancang skema database dari studi kasus marketplace, lalu menyederhanakannya untuk MVP tanpa kehilangan kemampuan berkembang
2. Membangun REST API dengan struktur MVC (config → controller → route)
3. Mengimplementasikan validasi dasar dan penanganan error di setiap endpoint
4. Membangun frontend statis yang mengambil data dari API, dengan fallback ke data contoh
5. Menyusun dokumentasi dan menyiapkan project untuk portfolio

## Cara Menjalankan Project

### 1. Siapkan database

```bash
mysql -u root -p -e "CREATE DATABASE mini_marketplace_catalog"
mysql -u root -p mini_marketplace_catalog < backend/database/schema.sql
mysql -u root -p mini_marketplace_catalog < backend/database/seed.sql
```

### 2. Jalankan backend

```bash
cd backend
npm install
cp .env.example .env   # sesuaikan DB_USER / DB_PASSWORD jika perlu
npm run dev             # atau: npm start
```

Backend ini juga langsung menyajikan frontend, jadi cukup buka:

**`http://localhost:3000`**

Halaman katalog akan langsung tampil dan terhubung ke API pada domain yang sama. Jika API/database belum aktif, halaman tetap menampilkan data contoh secara otomatis (ditandai status di bagian atas halaman).

## Deploy ke Railway

Project ini didesain agar backend & frontend jalan sebagai satu service di satu domain (backend menyajikan file frontend lewat `express.static`), sehingga proses deploy ke Railway jadi satu langkah:

1. **Push repository ke GitHub** (lihat langkah di bawah jika belum)
2. Di [Railway](https://railway.app), buat **New Project → Deploy from GitHub repo**, pilih repo ini
3. Karena backend ada di subfolder, buka **Settings** service tersebut → set **Root Directory** ke `backend`
4. Tambahkan **MySQL** ke project lewat **New → Database → Add MySQL**
5. Di service backend, buka tab **Variables**, tambahkan:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` → isi dari kredensial MySQL yang disediakan Railway (klik service MySQL → tab Variables untuk melihatnya)
   - `PORT` → biasanya sudah otomatis di-set Railway, tidak perlu diisi manual
6. Import `backend/database/schema.sql` dan `backend/database/seed.sql` ke database Railway tersebut (bisa lewat DBeaver, connect pakai kredensial dari Railway, atau lewat tab **Data** di dashboard Railway)
7. Railway akan otomatis menjalankan `npm install` dan `npm start` — tunggu build selesai
8. Buka domain yang diberikan Railway (format `xxxx.up.railway.app`) — katalog akan langsung tampil dengan data live

## Push ke GitHub

```bash
cd mini-marketplace-catalog
git init
git add .
git commit -m "Initial commit: Mini Marketplace Catalog"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

## Insight Sederhana dari Data

Dari 11 produk contoh yang di-seed:

- Kategori dengan jumlah produk terbanyak: **Elektronik** dan **Peralatan Rumah Tangga** (masing-masing berpotensi jadi kategori andalan bila divalidasi dengan data penjualan nyata)
- Rentang harga cukup lebar (Rp 22.000 – Rp 349.000), menunjukkan katalog bisa menampung produk dari kebutuhan harian sampai barang bernilai lebih tinggi
- Struktur ini siap ditambah query agregasi (produk terlaris, stok menipis, dll.) begitu tabel `order` diaktifkan

## Arah Pengembangan Selanjutnya

- Mengaktifkan endpoint `user`, `order`, dan `order_detail` untuk fitur transaksi
- Menambahkan autentikasi sederhana untuk role `seller` dan `buyer`
- Menambahkan upload gambar produk
- Menambahkan dashboard insight (produk terlaris, kategori paling diminati)

---

*Project ini dibuat sebagai bagian dari portfolio transisi karier dari perencanaan &amp; pengawasan desain arsitektur menuju Fullstack Web Development.*
