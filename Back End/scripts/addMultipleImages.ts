import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import the Vehicle model
import VehicleModel from '../src/models/VehicleNew';

// Sample car image URLs from Unsplash
const carImageSets = [
  // Luxury Sedans
  [
    'https://images.unsplash.com/photo-1555215858-9dc80a29fb4a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550355291-bbee04a701f5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=800&auto=format&fit=crop'
  ],
  // SUVs
  [
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528319032329-ab87a0a0229e?w=800&auto=format&fit=crop'
  ],
  // Sports Cars
  [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&auto=format&fit=crop'
  ],
  // Electric Cars
  [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=800&auto=format&fit=crop'
  ],
  // Trucks
  [
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569243478735-8fcf29052262?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop'
  ],
  // Classic Cars
  [
    'https://images.unsplash.com/photo-1563137391-9b2c1346c55f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574023278969-abb7ab49945c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop'
  ],
  // Modern Sedans
  [
    'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop'
  ],
  // Luxury SUVs
  [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&auto=format&fit=crop'
  ]
];

async function addMultipleImages() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all vehicles
    const vehicles = await VehicleModel.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    let updatedCount = 0;

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      
      // Get a random set of images based on vehicle index
      const imageSetIndex = i % carImageSets.length;
      const imageSet = carImageSets[imageSetIndex];
      
      // If vehicle already has multiple images, skip it
      if (vehicle.images && vehicle.images.length > 1) {
        console.log(`Vehicle ${vehicle.make} ${vehicle.model} already has ${vehicle.images.length} images, skipping...`);
        continue;
      }

      // Update the vehicle with multiple images
      // Keep the primaryImage as the first image in the array
      vehicle.images = [...imageSet];
      vehicle.primaryImage = imageSet[0];

      await vehicle.save();
      updatedCount++;
      console.log(`✅ Updated ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${imageSet.length} images`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} vehicles with multiple images`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addMultipleImages();