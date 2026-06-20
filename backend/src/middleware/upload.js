// src/middleware/upload.js
// Middleware upload file (poster lomba) menggunakan multer

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
require('dotenv').config();

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../../uploads/posters');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage - simpan file ke disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Format nama file: poster-<timestamp>-<random>.<ext>
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
    const ext          = path.extname(file.originalname).toLowerCase();
    cb(null, `poster-${uniqueSuffix}${ext}`);
  },
});

// Filter: hanya izinkan gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname      = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype     = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // default 5MB
  },
});

module.exports = upload;
