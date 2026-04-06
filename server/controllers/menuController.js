const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { availability: true };
    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};
