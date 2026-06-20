// src/controllers/auth.controller.js
// Logika bisnis untuk autentikasi pengguna

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/database');
const { validationResult } = require('express-validator');
require('dotenv').config();

// ─── Helper: buat JWT token ───────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    // Cek validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nama, email, password, role = 'mahasiswa', nim, jurusan,
            tipe_penyelenggara, nama_organisasi } = req.body;

    // Cek email sudah terdaftar
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // Hash password sebelum disimpan (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const tipe = role === 'penyelenggara' ? (tipe_penyelenggara || 'individu') : null;
    const namaOrg = role === 'penyelenggara' && tipe === 'organisasi' ? (nama_organisasi || null) : null;

    const [result] = await db.query(
      `INSERT INTO users (nama, email, password, role, nim, jurusan, tipe_penyelenggara, nama_organisasi)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, email, hashedPassword, role, nim || null, jurusan || null, tipe, namaOrg]
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: {
        id:      result.insertId,
        nama,
        email,
        role,
        token,
      },
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Cari user by email
    const [rows] = await db.query(
      'SELECT id, nama, email, password, role, foto_profil, is_active FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Akun Anda telah dinonaktifkan.' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        id:          user.id,
        nama:        user.nama,
        email:       user.email,
        role:        user.role,
        foto_profil: user.foto_profil,
        token,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// Ambil data profil user yang sedang login
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nama, email, phone, whatsapp, role, tipe_penyelenggara, nama_organisasi, nim, jurusan, foto_profil, bio, prestasi, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[getMe]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
// Update profil user
const updateProfile = async (req, res) => {
  try {
    const { nama, email, phone, whatsapp, nim, jurusan, bio, prestasi, nama_organisasi } = req.body;
    const foto_profil = req.file ? req.file.filename : undefined;

    const fields = [];
    const values = [];

    if (nama)            { fields.push('nama = ?');            values.push(nama); }
    if (email)           { fields.push('email = ?');           values.push(email); }
    if (phone)           { fields.push('phone = ?');           values.push(phone); }
    if (whatsapp)        { fields.push('whatsapp = ?');        values.push(whatsapp); }
    if (nim)             { fields.push('nim = ?');              values.push(nim); }
    if (jurusan)         { fields.push('jurusan = ?');          values.push(jurusan); }
    if (bio)             { fields.push('bio = ?');              values.push(bio); }
    if (prestasi)        { fields.push('prestasi = ?');         values.push(prestasi); }
    if (nama_organisasi) { fields.push('nama_organisasi = ?');  values.push(nama_organisasi); }
    if (foto_profil)     { fields.push('foto_profil = ?');      values.push(foto_profil); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data yang diupdate.' });
    }

    values.push(req.user.id);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    res.json({ success: true, message: 'Profil berhasil diperbarui.' });
  } catch (err) {
    console.error('[updateProfile]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── PUT /api/auth/change-password ───────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;

    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(password_lama, rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai.' });
    }

    const hashed = await bcrypt.hash(password_baru, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) {
    console.error('[changePassword]', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
