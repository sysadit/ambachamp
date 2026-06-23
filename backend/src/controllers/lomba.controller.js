// src/controllers/lomba.controller.js
// Logika bisnis untuk manajemen lomba/kompetisi

const db = require('../config/database');
const { validationResult } = require('express-validator');

// ─── GET /api/lomba ───────────────────────────────────────────────────────────
// Ambil semua lomba yang sudah verified, dengan filter opsional
const getAllLomba = async (req, res) => {
  try {
    const {
      kategori,   // filter kategori
      tingkat,    // filter tingkat (nasional, dll)
      gratis,     // '1' = tampilkan yang gratis saja
      keyword,    // search judul/deskripsi
      page  = 1,
      limit = 10,
    } = req.query;

    let sql    = 'SELECT l.*, u.nama AS nama_penyelenggara FROM lomba l JOIN users u ON l.penyelenggara_id = u.id WHERE l.status = "verified"';
    const args = [];

    if (kategori) { sql += ' AND l.kategori = ?';                    args.push(kategori); }
    if (tingkat)  { sql += ' AND l.tingkat = ?';                     args.push(tingkat); }
    if (gratis === '1') { sql += ' AND l.biaya_pendaftaran = 0'; }
    if (keyword)  { sql += ' AND (l.judul LIKE ? OR l.deskripsi LIKE ?)'; const k = `%${keyword}%`; args.push(k, k); }

    // Tambah order dan pagination
    sql += ' ORDER BY l.deadline_pendaftaran ASC';
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page) - 1) * parseInt(limit)}`;

    const [rows] = await db.query(sql, args);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getAllLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/lomba/:id ───────────────────────────────────────────────────────
// Detail satu lomba
const getLombaById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT l.*, u.nama AS nama_penyelenggara, u.email AS email_penyelenggara FROM lomba l JOIN users u ON l.penyelenggara_id = u.id WHERE l.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[getLombaById]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/lomba ──────────────────────────────────────────────────────────
// Penyelenggara mengunggah lomba baru (status = pending, menunggu verifikasi admin)
const createLomba = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      judul, deskripsi, kategori, tingkat,
      biaya_pendaftaran = 0, deadline_pendaftaran,
      tanggal_pelaksanaan, link_pendaftaran,
      link_sosmed, contact_person,
    } = req.body;

    const poster = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO lomba (judul, deskripsi, kategori, tingkat, biaya_pendaftaran,
        deadline_pendaftaran, tanggal_pelaksanaan, poster, link_pendaftaran,
        link_sosmed, contact_person, penyelenggara_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [judul, deskripsi, kategori, tingkat, biaya_pendaftaran,
       deadline_pendaftaran, tanggal_pelaksanaan || null,
       poster, link_pendaftaran || null,
       link_sosmed || null, contact_person || null, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Lomba berhasil diunggah. Menunggu verifikasi admin.',
      data: { id: result.insertId },
    });
  } catch (err) {
    console.error('[createLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/lomba/:id ───────────────────────────────────────────────────────
// Penyelenggara update lomba miliknya sendiri
const updateLomba = async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan lomba ini milik penyelenggara yang sedang login
    const [rows] = await db.query('SELECT * FROM lomba WHERE id = ? AND penyelenggara_id = ?', [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan atau bukan milik Anda.' });
    }

    const {
      judul, deskripsi, kategori, tingkat,
      biaya_pendaftaran, deadline_pendaftaran,
      tanggal_pelaksanaan, link_pendaftaran,
      link_sosmed, contact_person,
    } = req.body;

    const poster = req.file ? req.file.filename : rows[0].poster;

    await db.query(
      `UPDATE lomba SET judul=?, deskripsi=?, kategori=?, tingkat=?, biaya_pendaftaran=?,
       deadline_pendaftaran=?, tanggal_pelaksanaan=?, poster=?, link_pendaftaran=?,
       link_sosmed=?, contact_person=?, status='pending'
       WHERE id = ?`,
      [judul, deskripsi, kategori, tingkat, biaya_pendaftaran,
       deadline_pendaftaran, tanggal_pelaksanaan || null,
       poster, link_pendaftaran || null,
       link_sosmed || null, contact_person || null, id]
    );

    res.json({ success: true, message: 'Lomba berhasil diperbarui. Kembali menunggu verifikasi.' });
  } catch (err) {
    console.error('[updateLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── DELETE /api/lomba/:id ────────────────────────────────────────────────────
// Penyelenggara hapus lomba miliknya
const deleteLomba = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM lomba WHERE id = ? AND penyelenggara_id = ?', [req.params.id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan atau bukan milik Anda.' });
    }

    await db.query('DELETE FROM lomba WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Lomba berhasil dihapus.' });
  } catch (err) {
    console.error('[deleteLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/lomba/my-lomba ──────────────────────────────────────────────────
// Penyelenggara lihat lomba miliknya sendiri (semua status)
const getMyLomba = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM lomba WHERE penyelenggara_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[getMyLomba]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getAllLomba, getLombaById, createLomba, updateLomba, deleteLomba, getMyLomba };
