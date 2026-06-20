// src/routes/lomba.routes.js
const express  = require('express');
const router   = express.Router();
const { getAllLomba, getLombaById, createLomba, updateLomba, deleteLomba, getMyLomba } = require('../controllers/lomba.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body } = require('express-validator');

// Validasi create/update lomba
const validateLomba = [
  body('judul').notEmpty().withMessage('Judul lomba wajib diisi.'),
  body('deskripsi').notEmpty().withMessage('Deskripsi wajib diisi.'),
  body('kategori').isIn(['teknologi_digital','sains_riset','olahraga','seni_kreatif']).withMessage('Kategori tidak valid.'),
  body('tingkat').isIn(['kampus','nasional','internasional']).withMessage('Tingkat tidak valid.'),
  body('deadline_pendaftaran').isDate().withMessage('Format tanggal deadline tidak valid.'),
];

// Public - siapa saja bisa lihat lomba yang sudah verified
router.get('/', getAllLomba);
router.get('/:id', getLombaById);

// Penyelenggara
router.get('/my/list', protect, authorize('penyelenggara'), getMyLomba);
router.post('/', protect, authorize('penyelenggara'), upload.single('poster'), validateLomba, createLomba);
router.put('/:id', protect, authorize('penyelenggara'), upload.single('poster'), updateLomba);
router.delete('/:id', protect, authorize('penyelenggara'), deleteLomba);

module.exports = router;
