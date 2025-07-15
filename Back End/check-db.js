const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vida-rentals')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check vehicles collection
    const vehiclesCount = await mongoose.connection.db.collection('vehicles').countDocuments();
    console.log(`vehicles collection: ${vehiclesCount} documents`);
    
    // Check vehiclenews collection  
    const vehicleNewsCount = await mongoose.connection.db.collection('vehiclenews').countDocuments();
    console.log(`vehiclenews collection: ${vehicleNewsCount} documents`);
    
    // Show first vehicle from each collection
    const vehicle = await mongoose.connection.db.collection('vehicles').findOne();
    console.log('\nFirst vehicle:', vehicle ? vehicle.name : 'None');
    
    const vehicleNew = await mongoose.connection.db.collection('vehiclenews').findOne();
    console.log('First vehicleNew:', vehicleNew ? `${vehicleNew.make} ${vehicleNew.vehicleModel}` : 'None');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
