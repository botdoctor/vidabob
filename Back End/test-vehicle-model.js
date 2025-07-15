const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vida-rentals');
  console.log('Connected to MongoDB');
  
  // Import the actual model
  const Vehicle = require('./dist/models/VehicleNew').default;
  
  // Test direct query
  const vehicles = await Vehicle.find({});
  console.log(`Found ${vehicles.length} vehicles using model`);
  
  if (vehicles.length > 0) {
    const first = vehicles[0];
    console.log('\nFirst vehicle:');
    console.log('- make:', first.make);
    console.log('- vehicleModel:', first.vehicleModel);
    console.log('- available:', first.available);
    console.log('- type:', first.type);
    console.log('- _id:', first._id);
    
    // Test toJSON
    const json = first.toJSON();
    console.log('\ntoJSON output keys:', Object.keys(json).slice(0, 10));
  }
  
  process.exit(0);
}

test().catch(console.error);
