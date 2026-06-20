// src/routes/auth.routes.js
const express  = require('express');
const router   = express.Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect }  = require('../middleware/auth');
const upload       = require('../middleware/upload');
const { body }     = require('express-validator');

// Validasi register
const validateRegister = [
  body('nama').notEmpty().withMessage('Nama wajib diisi.'),
  body('email').isEmail().withMessage('Format email tidak valid.'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
  body('role').optional().isIn(['mahasiswa', 'penyelenggara']).withMessage('Role tidak valid.'),
];

// Validasi login
const validateLogin = [
  body('email').isEmail().withMessage('Format email tidak valid.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
];

// Public routes
router.post('/register', validateRegister, register);
router.post('/login',    validateLogin,    login);

// Protected routes (harus login)
router.get('/me',              protect, getMe);
router.put('/profile',         protect, upload.single('foto_profil'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
