// src/middleware/auth.js
// Middleware untuk verifikasi JWT token di setiap request yang butuh login

const jwt    = require('jsonwebtoken');
const db     = require('../config/database');
require('dotenv').config();

// ─── Middleware: cek apakah user sudah login ──────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // Token dikirim di header: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek user masih ada di database dan masih aktif
    const [rows] = await db.query(
      'SELECT id, nama, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0 || !rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan atau sudah dinonaktifkan.',
      });
    }

    req.user = rows[0]; // simpan data user di request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesi telah berakhir. Silakan login ulang.' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
};

// ─── Middleware: batasi akses berdasarkan role ────────────────────────────────
// Contoh pemakaian: authorize('admin'), authorize('admin', 'penyelenggara')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya ${roles.join(' / ')} yang bisa mengakses endpoint ini.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
