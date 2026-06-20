// src/routes/admin.routes.js
const express = require('express');
const router  = express.Router();
const { getPendingLomba, getAllLombaAdmin, verifyLomba, getAllUsers, createUser, toggleUserStatus, getDashboard } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// Semua route admin butuh login DAN role admin
router.use(protect, authorize('admin'));

router.get('/dashboard',             getDashboard);
router.get('/lomba',                 getAllLombaAdmin);
router.get('/lomba/pending',         getPendingLomba);
router.put('/lomba/:id/verify',      verifyLomba);
router.get('/users',                 getAllUsers);
router.post('/users',                createUser);
router.put('/users/:id/toggle',      toggleUserStatus);

module.exports = router;
