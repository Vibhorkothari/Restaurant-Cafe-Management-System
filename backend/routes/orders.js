const express = require('express');
const Order = require('../models/Order');
const Table = require('../models/Table');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.table) filter.table = req.query.table;
    const orders = await Order.find(filter)
      .populate('table')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/active', protect, async (_req, res) => {
  try {
    const orders = await Order.find({ status: { $nin: ['billed'] } })
      .populate('table')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/kitchen', protect, async (_req, res) => {
  try {
    const orders = await Order.find({ status: { $in: ['pending', 'preparing'] } })
      .populate('table')
      .sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table')
      .populate('createdBy', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { table, tableNumber, items } = req.body;
    const order = new Order({
      table,
      tableNumber,
      items,
      createdBy: req.user._id,
    });
    await order.save();

    await Table.findByIdAndUpdate(table, { status: 'occupied' });

    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name');

    const io = req.app.get('io');
    io.emit('newOrder', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/items', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.items = req.body.items;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name');

    const io = req.app.get('io');
    io.emit('orderUpdated', populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    if (req.body.status === 'billed') {
      order.billedAt = new Date();
      order.paymentMethod = req.body.paymentMethod || 'cash';
      await Table.findByIdAndUpdate(order.table, { status: 'available' });
    }
    await order.save();

    const populated = await Order.findById(order._id)
      .populate('table')
      .populate('createdBy', 'name');

    const io = req.app.get('io');
    io.emit('orderStatusChanged', populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
