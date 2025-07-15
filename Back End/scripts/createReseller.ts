import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';

dotenv.config();

async function createReseller() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Check if reseller already exists
    const existingReseller = await User.findOne({ 
      $or: [
        { email: 'john.doe@reseller.com' },
        { username: 'johndoe' }
      ]
    });

    if (existingReseller) {
      console.log('Reseller already exists:', existingReseller.email);
      process.exit(0);
    }

    // Create a new reseller
    const reseller = new User({
      username: 'johndoe',
      email: 'john.doe@reseller.com',
      password: 'reseller123', // Will be hashed by the pre-save hook
      firstName: 'John',
      lastName: 'Doe',
      role: 'reseller',
      commissionRate: 15, // 15% commission
      totalCommissions: 0,
      isActive: true,
      canMarkup: true,
      phone: '+1234567890',
      language: 'en',
      currency: 'USD'
    });

    await reseller.save();
    console.log('Reseller created successfully:', {
      username: reseller.username,
      email: reseller.email,
      commissionRate: reseller.commissionRate
    });

    // Create another reseller
    const reseller2 = new User({
      username: 'janedoe',
      email: 'jane.doe@reseller.com',
      password: 'reseller123',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'reseller',
      commissionRate: 12, // 12% commission
      totalCommissions: 1500, // Has earned some commissions
      isActive: true,
      canMarkup: true,
      phone: '+0987654321',
      language: 'es',
      currency: 'CRC'
    });

    await reseller2.save();
    console.log('Second reseller created successfully:', {
      username: reseller2.username,
      email: reseller2.email,
      commissionRate: reseller2.commissionRate
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createReseller();