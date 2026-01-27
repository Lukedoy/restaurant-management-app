// controllers/menuController.js
const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ availability: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
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
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};