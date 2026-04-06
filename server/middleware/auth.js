const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('status role');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.status === 'inactive') return res.status(403).json({ message: 'Account deactivated' });
    if (user.status === 'pending') return res.status(403).json({ message: 'Account pending approval' });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};