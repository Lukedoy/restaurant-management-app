
const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesReport } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/stats', auth, adminOnly, getDashboardStats);
router.get('/sales-report', auth, adminOnly, getSalesReport);

module.exports = router;