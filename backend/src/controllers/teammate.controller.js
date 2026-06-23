// src/controllers/teammate.controller.js
// Logika bisnis untuk fitur Teammate Finder

const db = require('../config/database');
const { validationResult } = require('express-validator');

// ─── GET /api/teammate ────────────────────────────────────────────────────────
// Ambil semua post yang sedang open
const getAllPosts = async (req, res) => {
  try {
    const { lomba_id, keyword } = req.query;

    let sql = `
      SELECT tp.*, u.nama AS nama_pembuat, u.jurusan,
             l.judul AS judul_lomba, l.kategori, l.deadline_pendaftaran
      FROM teammate_posts tp
      JOIN users u ON tp.pembuat_id = u.id
      JOIN lomba l ON tp.lomba_id = l.id
      WHERE tp.status = 'open' AND l.status = 'verified'
    `;
    const args = [];

    if (lomba_id) { sql += ' AND tp.lomba_id = ?'; args.push(lomba_id); }
    if (keyword)  { sql += ' AND (tp.judul LIKE ? OR tp.deskripsi LIKE ?)'; const k = `%${keyword}%`; args.push(k, k); }

    sql += ' ORDER BY tp.created_at DESC';

    const [rows] = await db.query(sql, args);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getAllPosts]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/teammate/:id ────────────────────────────────────────────────────
// Detail satu post teammate
const getPostById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tp.*, u.nama AS nama_pembuat, u.jurusan, u.nim,
              l.judul AS judul_lomba, l.kategori, l.deadline_pendaftaran
       FROM teammate_posts tp
       JOIN users u ON tp.pembuat_id = u.id
       JOIN lomba l ON tp.lomba_id = l.id
       WHERE tp.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post tidak ditemukan.' });
    }

    // Ambil juga list pelamar (hanya tampil ke pembuat post)
    let applications = [];
    if (req.user && req.user.id === rows[0].pembuat_id) {
      const [apps] = await db.query(
        `SELECT ta.*, u.nama AS nama_pelamar, u.jurusan, u.nim
         FROM teammate_applications ta
         JOIN users u ON ta.pelamar_id = u.id
         WHERE ta.post_id = ?`,
        [req.params.id]
      );
      applications = apps;
    }

    res.json({ success: true, data: { ...rows[0], applications } });
  } catch (err) {
    console.error('[getPostById]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/teammate ───────────────────────────────────────────────────────
// Buat post pencarian anggota tim
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lomba_id, judul, deskripsi, posisi_dibutuhkan, jumlah_anggota_max = 3 } = req.body;

    // Cek lomba ada dan masih open
    const [lomba] = await db.query('SELECT id FROM lomba WHERE id = ? AND status = "verified"', [lomba_id]);
    if (lomba.length === 0) {
      return res.status(404).json({ success: false, message: 'Lomba tidak ditemukan.' });
    }

    // posisi_dibutuhkan harus string JSON
    const posisiJSON = typeof posisi_dibutuhkan === 'string'
      ? posisi_dibutuhkan
      : JSON.stringify(posisi_dibutuhkan);

    const [result] = await db.query(
      'INSERT INTO teammate_posts (lomba_id, pembuat_id, judul, deskripsi, posisi_dibutuhkan, jumlah_anggota_max) VALUES (?, ?, ?, ?, ?, ?)',
      [lomba_id, req.user.id, judul, deskripsi, posisiJSON, jumlah_anggota_max]
    );

    res.status(201).json({
      success: true,
      message: 'Post pencarian tim berhasil dibuat!',
      data: { id: result.insertId },
    });
  } catch (err) {
    console.error('[createPost]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/teammate/:id/close ─────────────────────────────────────────────
// Pembuat menutup post (tim sudah penuh)
const closePost = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM teammate_posts WHERE id = ? AND pembuat_id = ?', [req.params.id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post tidak ditemukan atau bukan milik Anda.' });
    }

    await db.query('UPDATE teammate_posts SET status = "closed" WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Post berhasil ditutup.' });
  } catch (err) {
    console.error('[closePost]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/teammate/:postId/apply ────────────────────────────────────────
// Mahasiswa melamar posisi di suatu post
const applyToPost = async (req, res) => {
  try {
    const { posisi, pesan } = req.body;
    const { postId } = req.params;

    // Cek post ada dan masih open
    const [post] = await db.query('SELECT * FROM teammate_posts WHERE id = ? AND status = "open"', [postId]);
    if (post.length === 0) {
      return res.status(404).json({ success: false, message: 'Post tidak ditemukan atau sudah ditutup.' });
    }

    // User tidak boleh melamar postingannya sendiri
    if (post[0].pembuat_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Anda tidak bisa melamar post milik sendiri.' });
    }

    // Cek sudah pernah melamar
    const [existing] = await db.query('SELECT id FROM teammate_applications WHERE post_id = ? AND pelamar_id = ?', [postId, req.user.id]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Anda sudah pernah melamar post ini.' });
    }

    await db.query(
      'INSERT INTO teammate_applications (post_id, pelamar_id, posisi, pesan) VALUES (?, ?, ?, ?)',
      [postId, req.user.id, posisi, pesan || null]
    );

    // Kirim notifikasi ke pembuat post
    await db.query(
      'INSERT INTO notifikasi (user_id, judul, pesan, tipe) VALUES (?, ?, ?, "teammate")',
      [
        post[0].pembuat_id,
        'Ada Pelamar Baru!',
        `${req.user.nama} melamar posisi "${posisi}" di post tim Anda: "${post[0].judul}".`,
      ]
    );

    res.status(201).json({ success: true, message: 'Lamaran berhasil dikirim!' });
  } catch (err) {
    console.error('[applyToPost]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/teammate/applications/:appId ────────────────────────────────────
// Pembuat post terima / tolak lamaran
const updateApplication = async (req, res) => {
  try {
    const { status, link_telegram } = req.body; // 'diterima' atau 'ditolak'
    const { appId } = req.params;

    if (!['diterima', 'ditolak'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    // kalau diterima, link grup telegram wajib diisi
    if (status === 'diterima' && (!link_telegram || !link_telegram.trim())) {
      return res.status(400).json({ success: false, message: 'Link grup Telegram wajib diisi saat menerima pelamar.' });
    }

    // Ambil detail lamaran
    const [apps] = await db.query(
      `SELECT ta.*, tp.pembuat_id, tp.judul AS judul_post
       FROM teammate_applications ta
       JOIN teammate_posts tp ON ta.post_id = tp.id
       WHERE ta.id = ?`,
      [appId]
    );

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Lamaran tidak ditemukan.' });
    }

    if (apps[0].pembuat_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Hanya pembuat post yang bisa update status lamaran.' });
    }

    if (status === 'diterima') {
      await db.query('UPDATE teammate_applications SET status = ?, link_telegram = ? WHERE id = ?', [status, link_telegram.trim(), appId]);
    } else {
      await db.query('UPDATE teammate_applications SET status = ? WHERE id = ?', [status, appId]);
    }

    // Notifikasi ke pelamar
    const pesan = status === 'diterima'
      ? `Selamat! Lamaran Anda untuk posisi "${apps[0].posisi}" di "${apps[0].judul_post}" telah DITERIMA. Cek halaman Status Gabung untuk link grup Telegram.`
      : `Maaf, lamaran Anda untuk posisi "${apps[0].posisi}" di "${apps[0].judul_post}" ditolak.`;

    await db.query(
      'INSERT INTO notifikasi (user_id, judul, pesan, tipe) VALUES (?, ?, ?, "teammate")',
      [apps[0].pelamar_id, `Lamaran ${status === 'diterima' ? 'Diterima' : 'Ditolak'}`, pesan]
    );

    res.json({ success: true, message: `Lamaran berhasil ${status}.` });
  } catch (err) {
    console.error('[updateApplication]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/teammate/my-applications
// lamaran yang dikirim user. kalau diterima, ikut bawa link grup telegram
const getMyApplications = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ta.id, ta.posisi, ta.pesan, ta.status, ta.created_at,
              tp.judul AS judul_post,
              l.judul AS judul_lomba,
              pembuat.nama AS nama_pembuat,
              CASE WHEN ta.status = 'diterima' THEN ta.link_telegram ELSE NULL END AS link_telegram
       FROM teammate_applications ta
       JOIN teammate_posts tp ON ta.post_id = tp.id
       JOIN lomba l           ON tp.lomba_id = l.id
       JOIN users pembuat     ON tp.pembuat_id = pembuat.id
       WHERE ta.pelamar_id = ?
       ORDER BY ta.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[getMyApplications]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/teammate/penyelenggara/grup
// penyelenggara lihat semua grup tim yang dibuat mahasiswa di lomba miliknya
const getGrupPenyelenggara = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tp.id, tp.judul, tp.deskripsi, tp.jumlah_anggota_max, tp.status, tp.created_at,
              l.judul AS judul_lomba,
              pembuat.nama AS nama_pembuat,
              (SELECT COUNT(*) FROM teammate_applications ta
                WHERE ta.post_id = tp.id AND ta.status = 'diterima') AS jumlah_anggota
       FROM teammate_posts tp
       JOIN lomba l        ON tp.lomba_id = l.id
       JOIN users pembuat  ON tp.pembuat_id = pembuat.id
       WHERE l.penyelenggara_id = ?
       ORDER BY tp.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[getGrupPenyelenggara]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// GET /api/teammate/my-posts — tim/lowongan yang dibuat user (mahasiswa)
const getMyPosts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tp.*, l.judul AS judul_lomba
       FROM teammate_posts tp
       JOIN lomba l ON tp.lomba_id = l.id
       WHERE tp.pembuat_id = ?
       ORDER BY tp.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('[getMyPosts]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { getAllPosts, getPostById, createPost, closePost, applyToPost, updateApplication, getMyApplications, getGrupPenyelenggara, getMyPosts };
