// src/controllers/notifikasi.controller.js
// Logika bisnis untuk sistem notifikasi

const db = require('../config/database');

// ─── GET /api/notifikasi ──────────────────────────────────────────────────────
// Ambil notifikasi milik user yang login
const getNotifikasi = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );

    // Hitung jumlah yang belum dibaca
    const unread = rows.filter(n => !n.is_read).length;

    res.json({ success: true, unread, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getNotifikasi]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/notifikasi/:id/read ─────────────────────────────────────────────
// Tandai satu notifikasi sebagai sudah dibaca
const markAsRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifikasi SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Notifikasi ditandai sudah dibaca.' });
  } catch (err) {
    console.error('[markAsRead]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/notifikasi/read-all ─────────────────────────────────────────────
// Tandai semua notifikasi sebagai sudah dibaca
const markAllAsRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifikasi SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ success: true, message: 'Semua notifikasi telah ditandai sudah dibaca.' });
  } catch (err) {
    console.error('[markAllAsRead]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── DELETE /api/notifikasi/:id ──────────────────────────────────────────────
// Hapus satu notifikasi
const deleteNotifikasi = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notifikasi WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Notifikasi dihapus.' });
  } catch (err) {
    console.error('[deleteNotifikasi]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getNotifikasi, markAsRead, markAllAsRead, deleteNotifikasi };
