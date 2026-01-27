// models/Order.js
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  tableNumber: { type: Number, required: true },
  items: [{
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    specialRequests: String
  }],
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'],
    default: 'pending'
  },
  totalAmount: Number,
  discount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  waiterId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
