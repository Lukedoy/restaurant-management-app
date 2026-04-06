const express = require('express');
const router = express.Router();
const { getAllTables, updateTableStatus, assignOrderToTable, setTableCount } = require('../controllers/tableController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', auth, getAllTables);
router.put('/set-count', auth, adminOnly, setTableCount);
router.put('/:id/status', auth, updateTableStatus);
router.put('/:id/assign', auth, assignOrderToTable);

module.exports = router;
