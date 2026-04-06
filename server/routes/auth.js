const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { requireFields, validateEmail, validateEnum } = require('../middleware/validate');

router.post('/register',
  requireFields('name', 'email', 'password'),
  validateEmail,
  validateEnum('role', ['admin', 'waiter', 'chef']),
  register
);

router.post('/login',
  requireFields('email', 'password'),
  validateEmail,
  login
);

const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify user' });
  }
});

module.exports = router;
