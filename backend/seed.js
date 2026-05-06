require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');

const connectDB = require('./config/db');

const menuItems = [
  // Starters
  { name: 'Paneer Tikka', category: 'Starters', price: 220, isVeg: true, description: 'Grilled cottage cheese marinated in spices' },
  { name: 'Chicken Seekh Kebab', category: 'Starters', price: 280, isVeg: false, description: 'Minced chicken kebabs grilled on skewers' },
  { name: 'Veg Spring Rolls', category: 'Starters', price: 180, isVeg: true, description: 'Crispy rolls stuffed with vegetables' },
  { name: 'Fish Amritsari', category: 'Starters', price: 320, isVeg: false, description: 'Batter fried fish with Amritsari spices' },
  { name: 'Masala Papad', category: 'Starters', price: 80, isVeg: true, description: 'Roasted papad with onion-tomato topping' },
  { name: 'Tandoori Mushroom', category: 'Starters', price: 200, isVeg: true, description: 'Mushrooms marinated and cooked in tandoor' },

  // Mains
  { name: 'Butter Chicken', category: 'Mains', price: 350, isVeg: false, description: 'Creamy tomato-based chicken curry' },
  { name: 'Dal Makhani', category: 'Mains', price: 240, isVeg: true, description: 'Slow-cooked black lentils in buttery gravy' },
  { name: 'Paneer Butter Masala', category: 'Mains', price: 280, isVeg: true, description: 'Paneer in rich tomato and cashew gravy' },
  { name: 'Chicken Biryani', category: 'Mains', price: 320, isVeg: false, description: 'Fragrant basmati rice with spiced chicken' },
  { name: 'Veg Biryani', category: 'Mains', price: 250, isVeg: true, description: 'Aromatic rice with mixed vegetables' },
  { name: 'Chole Bhature', category: 'Mains', price: 180, isVeg: true, description: 'Spiced chickpeas with fried bread' },
  { name: 'Butter Naan', category: 'Mains', price: 60, isVeg: true, description: 'Soft bread brushed with butter' },
  { name: 'Jeera Rice', category: 'Mains', price: 140, isVeg: true, description: 'Cumin-tempered steamed rice' },

  // Drinks
  { name: 'Masala Chai', category: 'Drinks', price: 40, isVeg: true, description: 'Indian spiced tea' },
  { name: 'Cold Coffee', category: 'Drinks', price: 120, isVeg: true, description: 'Blended iced coffee with cream' },
  { name: 'Mango Lassi', category: 'Drinks', price: 100, isVeg: true, description: 'Sweet yogurt drink with mango pulp' },
  { name: 'Fresh Lime Soda', category: 'Drinks', price: 80, isVeg: true, description: 'Lime juice with soda water' },
  { name: 'Buttermilk (Chaas)', category: 'Drinks', price: 50, isVeg: true, description: 'Spiced yogurt drink' },
  { name: 'Mineral Water', category: 'Drinks', price: 30, isVeg: true, description: '500ml packaged water' },

  // Desserts
  { name: 'Gulab Jamun', category: 'Desserts', price: 100, isVeg: true, description: 'Deep-fried milk dumplings in sugar syrup' },
  { name: 'Rasmalai', category: 'Desserts', price: 120, isVeg: true, description: 'Soft paneer balls in sweetened milk' },
  { name: 'Brownie with Ice Cream', category: 'Desserts', price: 180, isVeg: true, description: 'Warm chocolate brownie with vanilla ice cream' },
  { name: 'Kulfi', category: 'Desserts', price: 90, isVeg: true, description: 'Traditional Indian frozen dessert' },
];

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await MenuItem.deleteMany({});
  await Table.deleteMany({});

  await User.create({
    name: 'Admin',
    email: 'admin@cafe.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'Waiter 1',
    email: 'waiter@cafe.com',
    password: 'waiter123',
    role: 'waiter',
  });

  await User.create({
    name: 'Kitchen Staff',
    email: 'kitchen@cafe.com',
    password: 'kitchen123',
    role: 'kitchen',
  });

  await MenuItem.insertMany(menuItems);

  const tables = Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
    status: 'available',
  }));
  await Table.insertMany(tables);

  console.log('Database seeded successfully!');
  console.log('Admin:   admin@cafe.com / admin123');
  console.log('Waiter:  waiter@cafe.com / waiter123');
  console.log('Kitchen: kitchen@cafe.com / kitchen123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
