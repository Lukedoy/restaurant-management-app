
const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  availability: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);