const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', auth, adminOnly, getAllUsers);
router.put('/:id/status', auth, adminOnly, updateUserStatus);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;
