const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/daily', protect, adminOnly, async (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      status: 'billed',
      billedAt: { $gte: start, $lte: end },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalCGST = orders.reduce((sum, o) => sum + o.cgst, 0);
    const totalSGST = orders.reduce((sum, o) => sum + o.sgst, 0);

    const dishCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        dishCount[key] = (dishCount[key] || 0) + item.quantity;
      });
    });

    const topDishes = Object.entries(dishCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const paymentBreakdown = {};
    orders.forEach((o) => {
      paymentBreakdown[o.paymentMethod] = (paymentBreakdown[o.paymentMethod] || 0) + o.total;
    });

    res.json({
      date: dateStr,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCGST: Math.round(totalCGST * 100) / 100,
      totalSGST: Math.round(totalSGST * 100) / 100,
      topDishes,
      paymentBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
