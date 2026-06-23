// src/app.js
// Entry point utama server backend AMBAchamp

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/lomba',       require('./routes/lomba.routes'));
app.use('/api/wishlist',    require('./routes/wishlist.routes'));
app.use('/api/teammate',    require('./routes/teammate.routes'));
app.use('/api/notifikasi',  require('./routes/notifikasi.routes'));
app.use('/api/admin',       require('./routes/admin.routes'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 AMBAchamp API berjalan!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.` });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar. Maksimal 5MB.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan server.',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║     AMBAchamp Backend API v1.0.0         ║');
  console.log('║     Platform Informasi Lomba Mahasiswa   ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Server : http://localhost:${PORT}          ║`);
  console.log(`║  Mode   : ${process.env.NODE_ENV || 'development'}                  ║`);
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
