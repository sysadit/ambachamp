// src/controllers/admin.controller.js
// Logika bisnis khusus Admin (verifikasi lomba, kelola pengguna)

const db = require('../config/database');
const bcrypt = require('bcryptjs');

// ─── GET /api/admin/lomba/pending ─────────────────────────────────────────────
// Daftar lomba yang menunggu verifikasi
const getPendingLomba = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT l.*, u.nama AS nama_penyelenggara, u.email AS email_penyelenggara
       FROM lomba l JOIN users u ON l.penyelenggara_id = u.id
       WHERE l.status = 'pending'
       ORDER BY l.created_at ASC`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getPendingLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/admin/lomba ─────────────────────────────────────────────────────
// Semua lomba dengan semua status
const getAllLombaAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT l.*, u.nama AS nama_penyelenggara FROM lomba l JOIN users u ON l.penyelenggara_id = u.id';
    const args = [];

    if (status) { sql += ' WHERE l.status = ?'; args.push(status); }
    sql += ' ORDER BY l.created_at DESC';

    const [rows] = await db.query(sql, args);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getAllLombaAdmin]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/admin/lomba/:id/verify ──────────────────────────────────────────
// Admin verifikasi atau tolak lomba
const verifyLomba = async (req, res) => {
  try {
    const { status, alasan_penolakan } = req.body;
    const { id } = req.params;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid. Gunakan "verified" atau "rejected".' });
    }

    if (status === 'rejected' && !alasan_penolakan) {
      return res.status(400).json({ success: false, message: 'Alasan penolakan wajib diisi.' });
    }

    // Ambil data lomba untuk keperluan notifikasi
    const [lomba] = await db.query(
      'SELECT l.*, u.id AS penyelenggara_user_id FROM lomba l JOIN users u ON l.penyelenggara_id = u.id WHERE l.id = ?',
      [id]
    );

    if (lomba.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan.' });
    }

    // Update status lomba
    await db.query(
      'UPDATE lomba SET status = ?, alasan_penolakan = ? WHERE id = ?',
      [status, alasan_penolakan || null, id]
    );

    // Kirim notifikasi ke penyelenggara
    const pesan = status === 'verified'
      ? `Lomba "${lomba[0].judul}" Anda telah diverifikasi dan sekarang sudah tayang di platform.`
      : `Lomba "${lomba[0].judul}" Anda ditolak. Alasan: ${alasan_penolakan}`;

    await db.query(
      'INSERT INTO notifikasi (user_id, judul, pesan, tipe) VALUES (?, ?, ?, "verifikasi")',
      [
        lomba[0].penyelenggara_id,
        status === 'verified' ? '✅ Lomba Diverifikasi' : '❌ Lomba Ditolak',
        pesan,
      ]
    );

    res.json({ success: true, message: `Lomba berhasil ${status === 'verified' ? 'diverifikasi' : 'ditolak'}.` });
  } catch (err) {
    console.error('[verifyLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
// Daftar semua pengguna
// POST /api/admin/users
// admin bikin akun baru, bisa role apapun termasuk admin
const createUser = async (req, res) => {
  try {
    const { nama, email, password, role = 'mahasiswa' } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashed, role]
    );

    res.status(201).json({ success: true, message: 'Akun berhasil dibuat.', data: { id: result.insertId } });
  } catch (err) {
    console.error('[createUser]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let sql = 'SELECT id, nama, email, role, nim, jurusan, is_active, created_at FROM users';
    const args = [];

    if (role) { sql += ' WHERE role = ?'; args.push(role); }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, args);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getAllUsers]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/admin/users/:id/toggle ──────────────────────────────────────────
// Aktifkan / nonaktifkan akun user
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin tidak bisa nonaktifkan dirinya sendiri
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Tidak bisa mengubah status akun sendiri.' });
    }

    const [rows] = await db.query('SELECT id, is_active FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const newStatus = !rows[0].is_active;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Akun user berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
    });
  } catch (err) {
    console.error('[toggleUserStatus]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
// Statistik ringkasan untuk dashboard admin
const getDashboard = async (req, res) => {
  try {
    const [[{ total_users }]]     = await db.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_lomba }]]     = await db.query('SELECT COUNT(*) AS total_lomba FROM lomba');
    const [[{ pending_lomba }]]   = await db.query('SELECT COUNT(*) AS pending_lomba FROM lomba WHERE status = "pending"');
    const [[{ verified_lomba }]]  = await db.query('SELECT COUNT(*) AS verified_lomba FROM lomba WHERE status = "verified"');
    const [[{ total_wishlist }]]  = await db.query('SELECT COUNT(*) AS total_wishlist FROM wishlist');
    const [[{ total_teammate }]]  = await db.query('SELECT COUNT(*) AS total_teammate FROM teammate_posts');

    res.json({
      success: true,
      data: {
        total_users,
        total_lomba,
        pending_lomba,
        verified_lomba,
        total_wishlist,
        total_teammate,
      },
    });
  } catch (err) {
    console.error('[getDashboard]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getPendingLomba, getAllLombaAdmin, verifyLomba, getAllUsers, createUser, toggleUserStatus, getDashboard };
