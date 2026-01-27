// controllers/adminController.js
exports.getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const MenuItem = require('../models/MenuItem');
    const Order = require('../models/Order');
    
    const totalUsers = await User.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalUsers,
      totalMenuItems,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orders = await Order.find({ status: 'completed' });
    
    const dailySales = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + order.totalAmount;
    });
    
    res.json(dailySales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales report' });
  }
};