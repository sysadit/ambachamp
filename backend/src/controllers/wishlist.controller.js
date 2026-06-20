// src/controllers/wishlist.controller.js
// Logika bisnis untuk fitur wishlist / simpan lomba

const db = require('../config/database');

// ─── GET /api/wishlist ────────────────────────────────────────────────────────
// Ambil semua lomba yang disimpan oleh user yang login
const getWishlist = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT l.*, w.created_at AS disimpan_pada, u.nama AS nama_penyelenggara
       FROM wishlist w
       JOIN lomba l ON w.lomba_id = l.id
       JOIN users u ON l.penyelenggara_id = u.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getWishlist]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/wishlist/:lombaId ──────────────────────────────────────────────
// Tambah lomba ke wishlist
const addToWishlist = async (req, res) => {
  try {
    const { lombaId } = req.params;

    // Cek lomba ada dan verified
    const [lomba] = await db.query('SELECT id FROM lomba WHERE id = ? AND status = "verified"', [lombaId]);
    if (lomba.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan.' });
    }

    // Cek sudah ada di wishlist
    const [existing] = await db.query('SELECT id FROM wishlist WHERE user_id = ? AND lomba_id = ?', [req.user.id, lombaId]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Lomba sudah ada di wishlist Anda.' });
    }

    await db.query('INSERT INTO wishlist (user_id, lomba_id) VALUES (?, ?)', [req.user.id, lombaId]);

    // Buat notifikasi otomatis tentang deadline
    const [lombaDetail] = await db.query('SELECT judul, deadline_pendaftaran FROM lomba WHERE id = ?', [lombaId]);
    if (lombaDetail.length > 0) {
      await db.query(
        'INSERT INTO notifikasi (user_id, judul, pesan, tipe) VALUES (?, ?, ?, "deadline")',
        [
          req.user.id,
          `Lomba Tersimpan: ${lombaDetail[0].judul}`,
          `Kamu telah menyimpan lomba "${lombaDetail[0].judul}". Deadline pendaftaran: ${lombaDetail[0].deadline_pendaftaran}. Jangan sampai ketinggalan!`,
        ]
      );
    }

    res.status(201).json({ success: true, message: 'Lomba berhasil ditambahkan ke wishlist.' });
  } catch (err) {
    console.error('[addToWishlist]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── DELETE /api/wishlist/:lombaId ───────────────────────────────────────────
// Hapus lomba dari wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND lomba_id = ?',
      [req.user.id, req.params.lombaId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ada di wishlist Anda.' });
    }

    res.json({ success: true, message: 'Lomba dihapus dari wishlist.' });
  } catch (err) {
    console.error('[removeFromWishlist]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
