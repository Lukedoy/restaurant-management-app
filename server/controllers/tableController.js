const mongoose = require('mongoose');
const Table = require('../models/Table');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });

    if (tables.length === 0) {
      const defaults = [];
      for (let i = 1; i <= 10; i++) {
        defaults.push({ tableNumber: i, capacity: 4, status: 'available' });
      }
      const created = await Table.insertMany(defaults);
      return res.json(created);
    }

    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
};

exports.updateTableStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid table ID' });
    }
    const { status } = req.body;
    const validStatuses = ['available', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const update = { status };

    if (status === 'available') {
      update.currentOrderId = null;
    }
    const table = await Table.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update table' });
  }
};

exports.assignOrderToTable = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid table ID' });
    }
    const { orderId } = req.body;
    if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const update = {
      currentOrderId: orderId || null,
      status: orderId ? 'occupied' : 'available'
    };

    const table = await Table.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign order to table' });
  }
};

exports.setTableCount = async (req, res) => {
  try {
    const { count } = req.body;
    if (!count || count < 1 || count > 50) {
      return res.status(400).json({ message: 'Table count must be between 1 and 50' });
    }

    const existing = await Table.find().sort({ tableNumber: 1 });
    const currentCount = existing.length;

    if (count > currentCount) {

      const newTables = [];
      for (let i = currentCount + 1; i <= count; i++) {
        newTables.push({ tableNumber: i, capacity: 4, status: 'available' });
      }
      await Table.insertMany(newTables);
    } else if (count < currentCount) {

      const tablesToRemove = existing.slice(count);
      const occupiedTable = tablesToRemove.find(t => t.status === 'occupied');
      if (occupiedTable) {
        return res.status(400).json({
          message: `Cannot remove Table ${occupiedTable.tableNumber} because it is occupied`
        });
      }
      const idsToRemove = tablesToRemove.map(t => t._id);
      await Table.deleteMany({ _id: { $in: idsToRemove } });
    }

    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update table count' });
  }
};
