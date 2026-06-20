// src/routes/wishlist.routes.js
const express = require('express');
const router  = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { protect, authorize } = require('../middleware/auth');

// Hanya mahasiswa yang bisa akses wishlist
router.get('/',         protect, authorize('mahasiswa'), getWishlist);
router.post('/:lombaId',   protect, authorize('mahasiswa'), addToWishlist);
router.delete('/:lombaId', protect, authorize('mahasiswa'), removeFromWishlist);

module.exports = router;
