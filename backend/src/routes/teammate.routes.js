// src/routes/teammate.routes.js
const express = require('express');
const router  = express.Router();
const { getAllPosts, getPostById, createPost, closePost, applyToPost, updateApplication, getMyApplications, getGrupPenyelenggara, getMyPosts } = require('../controllers/teammate.controller');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

const validatePost = [
  body('lomba_id').isInt().withMessage('Lomba ID harus berupa angka.'),
  body('judul').notEmpty().withMessage('Judul wajib diisi.'),
  body('deskripsi').notEmpty().withMessage('Deskripsi wajib diisi.'),
  body('posisi_dibutuhkan').notEmpty().withMessage('Posisi yang dibutuhkan wajib diisi.'),
];

// Public
router.get('/', getAllPosts);
router.get('/my-applications', protect, authorize('mahasiswa'), getMyApplications);
router.get('/my-posts', protect, authorize('mahasiswa'), getMyPosts);
router.get('/penyelenggara/grup', protect, authorize('penyelenggara'), getGrupPenyelenggara);
router.get('/:id', protect, getPostById); // protected supaya bisa lihat applicants

// Mahasiswa buat post dan apply
router.post('/',                          protect, authorize('mahasiswa'), validatePost, createPost);
router.put('/:id/close',                  protect, authorize('mahasiswa'), closePost);
router.post('/:postId/apply',             protect, authorize('mahasiswa'), applyToPost);
router.put('/applications/:appId',        protect, authorize('mahasiswa'), updateApplication);

module.exports = router;
