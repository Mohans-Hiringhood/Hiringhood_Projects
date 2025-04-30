require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();