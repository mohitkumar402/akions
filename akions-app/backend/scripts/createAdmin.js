require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ekions';

// Use env vars; in production these are required. No hardcoded credentials.
const adminEmail = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? null : 'admin@akions.com');
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? null : 'Admin@Local123');
const adminName = process.env.ADMIN_NAME || 'Admin User';

const createAdmin = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      if (!adminEmail || !adminPassword) {
        console.error('FATAL: In production set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
        process.exit(1);
      }
    } else if (!adminEmail || !adminPassword) {
      console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env, or use default (dev only).');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }

      if (adminPassword) {
        const isPasswordCorrect = await bcrypt.compare(adminPassword, existingAdmin.password);
        if (!isPasswordCorrect) {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          existingAdmin.password = hashedPassword;
          await existingAdmin.save();
          console.log('Updated admin password');
        }
      }

      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('ID:', adminUser._id);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
