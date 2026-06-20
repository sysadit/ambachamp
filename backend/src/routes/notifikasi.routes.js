// src/routes/notifikasi.routes.js
const express = require('express');
const router  = express.Router();
const { getNotifikasi, markAsRead, markAllAsRead, deleteNotifikasi } = require('../controllers/notifikasi.controller');
const { protect } = require('../middleware/auth');

router.get('/',              protect, getNotifikasi);
router.put('/read-all',      protect, markAllAsRead);
router.put('/:id/read',      protect, markAsRead);
router.delete('/:id',        protect, deleteNotifikasi);

module.exports = router;
