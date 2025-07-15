import mongoose from 'mongoose';
// import Vehicle from '../models/Vehicle'; // Old model (deleted)
import VehicleNew from '../models/VehicleNew'; // New model
import connectDB from '../utils/database';

// Helper function to parse make and model from old name field
const parseMakeModel = (name: string): { make: string; model: string } => {
  const parts = name.trim().split(' ');
  const make = parts[0] || 'Unknown';
  const model = parts.slice(1).join(' ') || 'Unknown';
  return { make, model };
};

// Helper function to map old category to new category
const mapCategory = (oldCategory: string): 'sedan' | 'suv' | 'truck' | 'coupe' | 'hatchback' | 'convertible' | 'van' | 'motorcycle' => {
  const categoryMap: Record<string, 'sedan' | 'suv' | 'truck' | 'coupe' | 'hatchback' | 'convertible' | 'van' | 'motorcycle'> = {
    economy: 'sedan',
    compact: 'hatchback',
    suv: 'suv',
    luxury: 'sedan'
  };
  return categoryMap[oldCategory] || 'sedan';
};

// Helper function to generate random but realistic vehicle data
const generateRandomData = () => {
  const colors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Gold'];
  const conditions = ['excellent', 'good', 'fair'] as const;
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  
  return {
    year: years[Math.floor(Math.random() * years.length)],
    mileage: Math.floor(Math.random() * 100000) + 5000,
    color: {
      exterior: colors[Math.floor(Math.random() * colors.length)],
    },
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    doors: Math.floor(Math.random() * 3) + 2, // 2-4 doors
  };
};

const migrateVehicles = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all vehicles from old collection
    const oldVehicles = await Vehicle.find({});
    console.log(`Found ${oldVehicles.length} vehicles to migrate`);

    // Clear new collection
    await VehicleNew.deleteMany({});
    console.log('Cleared new vehicle collection');

    let migratedCount = 0;

    for (const oldVehicle of oldVehicles) {
      try {
        const { make, model } = parseMakeModel(oldVehicle.name);
        const randomData = generateRandomData();

        // Map old vehicle to new schema
        const newVehicleData = {
          // Core Information
          make,
          model,
          year: randomData.year,
          
          // Categorization
          category: mapCategory(oldVehicle.category),
          type: 'both' as const, // Default to both sale and rental
          
          // Pricing (convert old rental-only pricing to comprehensive pricing)
          rentalPrice: oldVehicle.price,
          rentalPriceColones: oldVehicle.pricecolones,
          minRentalPrice: oldVehicle.minPrice,
          salePrice: oldVehicle.price * 365 * 3, // Estimate sale price (3 years of rental)
          salePriceColones: oldVehicle.pricecolones * 365 * 3,
          
          // Technical Specifications
          engine: {
            fuel: oldVehicle.fuel || 'gasoline',
            displacement: Math.random() > 0.5 ? Math.round((Math.random() * 3 + 1) * 10) / 10 : undefined, // 1.0-4.0L
            horsepower: Math.random() > 0.5 ? Math.floor(Math.random() * 200 + 120) : undefined, // 120-320hp
          },
          transmission: oldVehicle.transmission,
          seats: oldVehicle.seats,
          doors: randomData.doors,
          
          // Physical Attributes
          mileage: randomData.mileage,
          color: randomData.color,
          condition: randomData.condition,
          images: [oldVehicle.image],
          primaryImage: oldVehicle.image,
          
          // Features (generated from old data)
          features: [
            `${oldVehicle.seats} seats`,
            `${oldVehicle.transmission} transmission`,
            `${oldVehicle.fuel || 'gasoline'} engine`,
            'Air conditioning',
            'Power steering',
            'Power windows'
          ],
          
          // Availability & Status
          status: oldVehicle.available ? 'available' : 'sold' as const,
          available: oldVehicle.available,
          isFeatures: oldVehicle.available && Math.random() > 0.7, // 30% chance of being featured
          
          // Rental-Specific
          bookedDates: oldVehicle.bookedDates || [],
          minRentalDays: 1,
          maxRentalDays: 30,
          
          // Metadata
          description: `${make} ${model} (${randomData.year}) - A reliable ${mapCategory(oldVehicle.category)} available for both rental and purchase. Features ${oldVehicle.transmission} transmission and ${oldVehicle.fuel || 'gasoline'} engine.`,
          tags: [make.toLowerCase(), model.toLowerCase(), mapCategory(oldVehicle.category), oldVehicle.fuel || 'gasoline'],
          
          // Preserve timestamps if available
          createdAt: oldVehicle.createdAt || new Date(),
          updatedAt: oldVehicle.updatedAt || new Date(),
        };

        // Create new vehicle
        const newVehicle = new VehicleNew(newVehicleData);
        await newVehicle.save();
        
        migratedCount++;
        console.log(`✅ Migrated: ${make} ${model} (${randomData.year})`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate vehicle ${oldVehicle.name}:`, error);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Successfully migrated: ${migratedCount}/${oldVehicles.length} vehicles`);
    
    // Show some stats
    const totalNew = await VehicleNew.countDocuments();
    const availableCount = await VehicleNew.countDocuments({ available: true });
    const featuredCount = await VehicleNew.countDocuments({ isFeatures: true });
    
    console.log(`\n📈 New collection stats:`);
    console.log(`   Total vehicles: ${totalNew}`);
    console.log(`   Available: ${availableCount}`);
    console.log(`   Featured: ${featuredCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Helper function to update controllers to use new model (optional)
const updateToNewModel = async () => {
  console.log('\n📝 Next steps:');
  console.log('1. Update vehicle controllers to use VehicleNew model');
  console.log('2. Update vehicle routes to handle new schema');
  console.log('3. Test API endpoints with new data structure');
  console.log('4. Remove old Vehicle model after verification');
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateVehicles().then(() => {
    updateToNewModel();
  });
}

export default migrateVehicles;