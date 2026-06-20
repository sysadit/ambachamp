# AMBAchamp — Backend API

Platform Informasi Lomba Mahasiswa | Capuchino4life | STT-NF

---

## 📁 Struktur Folder

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         ← Koneksi MySQL
│   ├── middleware/
│   │   ├── auth.js             ← Verifikasi JWT token
│   │   └── upload.js           ← Upload poster (multer)
│   ├── routes/
│   │   ├── auth.routes.js      ← /api/auth
│   │   ├── lomba.routes.js     ← /api/lomba
│   │   ├── wishlist.routes.js  ← /api/wishlist
│   │   ├── teammate.routes.js  ← /api/teammate
│   │   ├── notifikasi.routes.js← /api/notifikasi
│   │   └── admin.routes.js     ← /api/admin
│   ├── controllers/            ← Logika bisnis tiap fitur
│   └── app.js                  ← Entry point server
├── database/
│   └── ambachamp.sql           ← Schema database
├── uploads/posters/            ← Tempat poster lomba
├── .env                        ← Konfigurasi environment
├── .gitignore
└── package.json
```

---

## 🔌 Daftar API Endpoint

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| GET | /api/health | Public | Cek server jalan |
| POST | /api/auth/register | Public | Daftar akun |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Login | Profil sendiri |
| PUT | /api/auth/profile | Login | Update profil |
| GET | /api/lomba | Public | Daftar lomba verified |
| GET | /api/lomba/:id | Public | Detail lomba |
| POST | /api/lomba | Penyelenggara | Upload lomba baru |
| PUT | /api/lomba/:id | Penyelenggara | Edit lomba |
| DELETE | /api/lomba/:id | Penyelenggara | Hapus lomba |
| GET | /api/wishlist | Mahasiswa | Lihat wishlist |
| POST | /api/wishlist/:lombaId | Mahasiswa | Simpan lomba |
| DELETE | /api/wishlist/:lombaId | Mahasiswa | Hapus dari wishlist |
| GET | /api/teammate | Public | Cari open post |
| POST | /api/teammate | Mahasiswa | Buat post cari tim |
| POST | /api/teammate/:postId/apply | Mahasiswa | Lamar posisi |
| PUT | /api/teammate/applications/:id | Mahasiswa | Terima/tolak lamaran |
| GET | /api/notifikasi | Login | Lihat notifikasi |
| PUT | /api/notifikasi/read-all | Login | Baca semua |
| GET | /api/admin/dashboard | Admin | Statistik |
| GET | /api/admin/lomba/pending | Admin | Lomba pending |
| PUT | /api/admin/lomba/:id/verify | Admin | Verifikasi lomba |
| GET | /api/admin/users | Admin | Kelola pengguna |

---

## 🧪 Cara Test API

Download **Postman** atau gunakan **Thunder Client** extension di VSCode.

**Login sebagai admin:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@ambachamp.id",
  "password": "password"
}
```
Salin token dari response, lalu pakai di header:
```
Authorization: Bearer <token_kamu>
```
