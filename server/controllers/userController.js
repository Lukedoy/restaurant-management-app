const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page, limit } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * pageLimit;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be active or inactive' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (targetUser.role === 'admin' && status === 'inactive') {
      return res.status(403).json({ message: 'Cannot deactivate an admin account' });
    }

    targetUser.status = status;
    targetUser.updatedAt = Date.now();
    await targetUser.save();

    const result = targetUser.toObject();
    delete result.password;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
};
