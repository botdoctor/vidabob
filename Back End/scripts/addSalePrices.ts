import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../src/models/Vehicle';

dotenv.config();

async function addSalePrices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Get all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    // Update each vehicle with a sale price (rental price * 150 days)
    for (const vehicle of vehicles) {
      if (!vehicle.salePrice) {
        vehicle.salePrice = vehicle.price * 150; // Estimate sale price as 150 days of rental
        await vehicle.save();
        console.log(`Updated ${vehicle.name} with sale price: $${vehicle.salePrice}`);
      }
    }

    console.log('All vehicles updated with sale prices');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addSalePrices();