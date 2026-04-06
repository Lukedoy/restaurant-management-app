const mongoose = require('mongoose');
const Order = require('../models/Order');
const Table = require('../models/Table');

function calcPaymentStatus(items) {
  const allPaid = items.every(i => i.paid);
  const nonePaid = items.every(i => !i.paid);
  if (allPaid) return 'completed';
  if (nonePaid) return 'unpaid';
  return 'partially_paid';
}

exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (tableNumber === undefined || tableNumber === null || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'tableNumber and items are required' });
    }

    const now = new Date();
    const enrichedItems = items.map(item => ({
      ...item,
      status: 'confirmed',
      paid: false,
      createdAt: now
    }));

    const totalAmount = enrichedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = `ORD-${Date.now()}`;

    const order = new Order({
      orderNumber,
      tableNumber: Number(tableNumber),
      items: enrichedItems,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      waiterId: req.user ? req.user.id : null
    });

    await order.save();

    if (Number(tableNumber) > 0) {
      await Table.findOneAndUpdate({ tableNumber }, { status: 'occupied', currentOrderId: order._id });
    }

    const io = req.app.get('io');
    if (io) io.emit('order:new', order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, search, from, to, page, limit } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } }
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * pageLimit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageLimit),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrderItems = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const now = new Date();
    const updatedItems = items.map(item => ({
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      specialRequests: item.specialRequests || '',
      status: item.status || 'confirmed',
      paid: item.paid !== undefined ? item.paid : false,
      createdAt: item.createdAt || now
    }));

    order.items = updatedItems;
    order.totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    order.paymentStatus = calcPaymentStatus(updatedItems);
    order.updatedAt = Date.now();
    await order.save();

    const io = req.app.get('io');
    if (io) io.emit('order:updated', { orderId: order._id, order });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order items' });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const { itemIndex, status } = req.body;
    const validStatuses = ['confirmed', 'preparing', 'ready'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid item status. Allowed: ${validStatuses.join(', ')}` });
    }
    if (itemIndex === undefined || itemIndex < 0) {
      return res.status(400).json({ message: 'itemIndex is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (itemIndex >= order.items.length) {
      return res.status(400).json({ message: 'Invalid item index' });
    }

    order.items[itemIndex].status = status;

    const allReady = order.items.every(i => i.status === 'ready');
    const anyPreparing = order.items.some(i => i.status === 'preparing');
    if (allReady) {
      order.status = 'ready';
    } else if (anyPreparing || order.items.some(i => i.status === 'ready')) {
      order.status = 'preparing';
    } else {
      order.status = 'confirmed';
    }

    order.updatedAt = Date.now();
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('order:updated', { orderId: order._id, order });
      if (allReady) {
        io.emit('order:statusChanged', { orderId: order._id, status: 'ready', order });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item status' });
  }
};

exports.reassignTable = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const { tableNumber } = req.body;
    if (tableNumber === undefined || tableNumber === null) {
      return res.status(400).json({ message: 'tableNumber is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const oldTableNumber = order.tableNumber;
    const newTableNumber = Number(tableNumber);

    if (oldTableNumber > 0) {
      await Table.findOneAndUpdate(
        { tableNumber: oldTableNumber },
        { status: 'available', currentOrderId: null }
      );
    }

    if (newTableNumber > 0) {
      await Table.findOneAndUpdate(
        { tableNumber: newTableNumber },
        { status: 'occupied', currentOrderId: order._id }
      );
    }

    order.tableNumber = newTableNumber;
    order.updatedAt = Date.now();
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('order:updated', { orderId: order._id, order });
      if (oldTableNumber > 0) io.emit('table:updated', { tableNumber: oldTableNumber, status: 'available' });
      if (newTableNumber > 0) io.emit('table:updated', { tableNumber: newTableNumber, status: 'occupied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reassign table' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const { status } = req.body;

    const validStatuses = ['confirmed', 'preparing', 'ready', 'served', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status === 'completed' && order.tableNumber > 0) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'available', currentOrderId: null }
      );
      const io = req.app.get('io');
      if (io) io.emit('table:updated', { tableNumber: order.tableNumber, status: 'available' });
    }

    const io = req.app.get('io');
    if (io) io.emit('order:statusChanged', { orderId: order._id, status, order });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

exports.processPayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const { paymentMethod, discount } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.items = order.items.map(item => {
      const obj = item.toObject();
      if (!obj.paid) obj.paid = true;
      return obj;
    });

    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentStatus = 'completed';
    if (discount !== undefined) order.discount = discount;
    order.updatedAt = Date.now();
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('order:paymentCompleted', { orderId: order._id, order });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to process payment' });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', updatedAt: Date.now() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.tableNumber > 0) {
      await Table.findOneAndUpdate(
        { tableNumber: order.tableNumber },
        { status: 'available', currentOrderId: null }
      );
    }

    const io = req.app.get('io');
    if (io) io.emit('order:completed', { orderId: order._id, order });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete order' });
  }
};
