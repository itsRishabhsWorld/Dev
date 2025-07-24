const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('../models/User');

// Sample users data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@bhattpharma.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0001',
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'AC',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    name: 'Manager User',
    email: 'manager@bhattpharma.com',
    password: 'manager123',
    role: 'manager',
    phone: '+1-555-0002',
    address: {
      street: '456 Manager Avenue',
      city: 'Manager City',
      state: 'MC',
      zipCode: '67890',
      country: 'USA'
    }
  },
  {
    name: 'Pharmacist User',
    email: 'pharmacist@bhattpharma.com',
    password: 'pharmacist123',
    role: 'pharmacist',
    phone: '+1-555-0003',
    address: {
      street: '789 Pharmacist Road',
      city: 'Pharmacist City',
      state: 'PC',
      zipCode: '11111',
      country: 'USA'
    }
  },
  {
    name: 'Staff User',
    email: 'staff@bhattpharma.com',
    password: 'staff123',
    role: 'staff',
    phone: '+1-555-0004',
    address: {
      street: '321 Staff Lane',
      city: 'Staff City',
      state: 'SC',
      zipCode: '22222',
      country: 'USA'
    }
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing users (optional - remove this line if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create sample users
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.email})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Database seeding completed successfully!');
    console.log('\n=== Login Credentials ===');
    sampleUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedUsers();