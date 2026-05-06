const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Starters', 'Mains', 'Drinks', 'Desserts'],
  },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  image: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
