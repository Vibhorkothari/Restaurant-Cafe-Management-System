const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  tableNumber: { type: Number, required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'billed'],
    default: 'pending',
  },
  subtotal: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billedAt: { type: Date },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'razorpay'], default: 'cash' },
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.cgst = Math.round(this.subtotal * 0.025 * 100) / 100; // 2.5% CGST
  this.sgst = Math.round(this.subtotal * 0.025 * 100) / 100; // 2.5% SGST
  this.total = Math.round((this.subtotal + this.cgst + this.sgst) * 100) / 100;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
