// routes/admin.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesReport } = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/stats', auth, getDashboardStats);
router.get('/sales-report', auth, getSalesReport);

module.exports = router;