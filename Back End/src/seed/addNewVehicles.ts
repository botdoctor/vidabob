import mongoose from 'mongoose';
import Vehicle from '../models/VehicleNew';
import connectDB from '../utils/database';

const newVehicles = [
  {
    name: 'Nissan Frontiere NP300',
    category: 'suv' as const,
    price: 200, // Daily rental price in USD (derived from $35,900 sale price)
    pricecolones: 100000, // Daily rental price in CRC
    minPrice: 180, // Minimum reseller price
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
    seats: 5,
    transmission: 'automatic' as const,
    fuel: 'gasoline' as const, // Diesel mapped to gasoline for compatibility
    available: false, // Marked as sold
    bookedDates: [],
    year: 2017,
    mileage: 113000,
    salePrice: 35900,
    status: 'sold'
  },
  {
    name: 'Nissan Frontiere PRO 4X',
    category: 'suv' as const,
    price: 195, // Daily rental price in USD
    pricecolones: 97500, // Daily rental price in CRC
    minPrice: 175, // Minimum reseller price
    image: 'https://images.unsplash.com/photo-1562141961-d67906293910?w=400&h=300&fit=crop',
    seats: 5,
    transmission: 'automatic' as const,
    fuel: 'gasoline' as const,
    available: true, // Featured vehicle
    bookedDates: [],
    year: 2019,
    mileage: 50983,
    salePrice: 34900,
    status: 'featured'
  },
  {
    name: 'Mitsubishi ASX',
    category: 'suv' as const,
    price: 125, // Daily rental price in USD
    pricecolones: 62500, // Daily rental price in CRC
    minPrice: 110, // Minimum reseller price
    image: 'https://images.unsplash.com/photo-1602586244991-cb155c08b95c?w=400&h=300&fit=crop',
    seats: 5,
    transmission: 'automatic' as const,
    fuel: 'gasoline' as const,
    available: true, // Featured vehicle
    bookedDates: [],
    year: 2019,
    mileage: 103727,
    salePrice: 21900,
    status: 'featured'
  },
  {
    name: 'Mitsubishi Montero Sport XLS',
    category: 'suv' as const,
    price: 75, // Daily rental price in USD
    pricecolones: 37500, // Daily rental price in CRC
    minPrice: 65, // Minimum reseller price
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    seats: 7,
    transmission: 'automatic' as const,
    fuel: 'gasoline' as const,
    available: true,
    bookedDates: [],
    year: 2001,
    mileage: 188,
    salePrice: 11900,
    status: 'available'
  }
];

const addVehicles = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    console.log('Adding new vehicles...');
    
    for (const vehicleData of newVehicles) {
      // Check if vehicle already exists
      const existingVehicle = await Vehicle.findOne({ name: vehicleData.name });
      if (existingVehicle) {
        console.log(`Vehicle already exists: ${vehicleData.name}`);
        continue;
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();
      console.log(`✅ Added vehicle: ${vehicleData.name} (${vehicleData.year}) - Status: ${vehicleData.status}`);
    }

    console.log('✅ All vehicles added successfully!');
    
    // Show current vehicle count
    const totalVehicles = await Vehicle.countDocuments();
    console.log(`📊 Total vehicles in database: ${totalVehicles}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding vehicles:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  addVehicles();
}

export default addVehicles;