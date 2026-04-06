const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const status = role === 'admin' ? 'pending' : 'active';
    const user = new User({ name, email, password, role, status });
    await user.save();

    if (status === 'pending') {
      return res.status(201).json({
        pending: true,
        message: 'Admin account created. An existing administrator must approve your account before you can log in.'
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact an administrator.' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval. Please wait for an administrator to approve your account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};
