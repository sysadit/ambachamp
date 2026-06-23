// src/routes/teammate.routes.js
const express = require('express');
const router  = express.Router();
const {
  getAllPosts, getPostById, createPost, closePost, applyToPost,
  updateApplication, getMyApplications, getGrupPenyelenggara, getMyPosts,
  updatePost, deletePost
} = require('../controllers/teammate.controller');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

const validatePost = [
  body('lomba_id').isInt().withMessage('Lomba ID harus berupa angka.'),
  body('judul').notEmpty().withMessage('Judul wajib diisi.'),
  body('deskripsi').notEmpty().withMessage('Deskripsi wajib diisi.'),
  body('posisi_dibutuhkan').notEmpty().withMessage('Posisi yang dibutuhkan wajib diisi.'),
  body('link_telegram').notEmpty().withMessage('Link Telegram wajib diisi.'),
];

// Public / Shared
router.get('/', getAllPosts);
router.get('/my-applications', protect, authorize('mahasiswa'), getMyApplications);
router.get('/my-posts', protect, authorize('mahasiswa'), getMyPosts);
router.get('/penyelenggara/grup', protect, authorize('penyelenggara'), getGrupPenyelenggara);
router.get('/:id', protect, getPostById); // protected supaya bisa lihat applicants

// Mahasiswa & Penyelenggara CRUD tim
router.post('/',                          protect, authorize('mahasiswa', 'penyelenggara'), validatePost, createPost);
router.put('/:id',                         protect, authorize('mahasiswa', 'penyelenggara'), validatePost, updatePost);
router.delete('/:id',                      protect, authorize('mahasiswa', 'penyelenggara'), deletePost);
router.put('/:id/close',                  protect, authorize('mahasiswa', 'penyelenggara'), closePost);
router.post('/:postId/apply',             protect, authorize('mahasiswa'), applyToPost);
router.put('/applications/:appId',        protect, authorize('mahasiswa', 'penyelenggara'), updateApplication);

module.exports = router;
