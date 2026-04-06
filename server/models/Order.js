const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  tableNumber: { type: Number, required: true, default: 0 },
  items: [{
    menuItemId: mongoose.Schema.Types.ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    specialRequests: String,
    status: {
      type: String,
      enum: ['confirmed', 'preparing', 'ready'],
      default: 'confirmed'
    },
    paid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'served', 'completed'],
    default: 'confirmed'
  },
  totalAmount: Number,
  discount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'completed'], default: 'unpaid' },
  waiterId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
