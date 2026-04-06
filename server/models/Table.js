
const mongoose = require("mongoose");
const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  currentOrderId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Table', tableSchema);