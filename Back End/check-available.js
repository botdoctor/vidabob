const mongoose = require('mongoose');
require('dotenv').config();

// Define the schema inline to check
const VehicleSchema = new mongoose.Schema({
  make: String,
  vehicleModel: String,
  available: Boolean,
  status: String
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vida-rentals')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const VehicleNew = mongoose.model('VehicleNew', VehicleSchema, 'vehiclenews');
    
    // Check all vehicles
    const allVehicles = await VehicleNew.find({}).select('make vehicleModel available status');
    console.log(`Total vehicles: ${allVehicles.length}`);
    
    // Check available vehicles
    const availableVehicles = await VehicleNew.find({ available: true }).select('make vehicleModel available status');
    console.log(`Available vehicles: ${availableVehicles.length}`);
    
    // Show first few vehicles
    console.log('\nFirst 3 vehicles:');
    allVehicles.slice(0, 3).forEach(v => {
      console.log(`- ${v.make} ${v.vehicleModel}: available=${v.available}, status=${v.status}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
