// controllers/orderController.js
const Order = require('../models/Order');
const Table = require('../models/Table');

exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items, waiterId } = req.body;
    
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = `ORD-${Date.now()}`;
    
    const order = new Order({
      orderNumber,
      tableNumber,
      items,
      totalAmount,
      waiterId
    });
    
    await order.save();
    
    await Table.findOneAndUpdate({ tableNumber }, { status: 'occupied', currentOrderId: order._id });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    await Table.findOneAndUpdate({ tableNumber: order.tableNumber }, { status: 'available', currentOrderId: null });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete order' });
  }
};