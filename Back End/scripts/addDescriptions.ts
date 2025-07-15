import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../src/models/Vehicle';

dotenv.config();

const vehicleDescriptions: Record<string, string> = {
  'Toyota Corolla': 'The Toyota Corolla is a reliable and fuel-efficient compact sedan that offers exceptional value. Known for its longevity and low maintenance costs, this vehicle features a comfortable interior, advanced safety features, and excellent fuel economy. Perfect for daily commuting or long road trips.',
  'Honda CR-V': 'The Honda CR-V is a versatile and spacious SUV that combines comfort with capability. With its roomy interior, advanced safety features, and impressive cargo space, it\'s perfect for families and adventure seekers alike. The CR-V offers excellent fuel efficiency for its class and a smooth, refined ride.',
  'Toyota Camry': 'The Toyota Camry is a midsize sedan that delivers a perfect balance of comfort, performance, and reliability. With its spacious interior, smooth ride quality, and comprehensive suite of safety features, the Camry is ideal for both business and leisure travel. It offers excellent fuel economy and a refined driving experience.',
  'Ford Explorer': 'The Ford Explorer is a powerful and capable three-row SUV designed for those who need space and versatility. With seating for up to seven passengers, advanced towing capabilities, and modern technology features, the Explorer is perfect for large families or those who need to haul cargo regularly.',
  'Nissan Altima': 'The Nissan Altima is a stylish midsize sedan that offers a compelling blend of performance, comfort, and technology. Featuring a spacious cabin, advanced driver assistance systems, and impressive fuel efficiency, the Altima provides a refined and enjoyable driving experience for daily commutes and long journeys.',
  'Chevrolet Tahoe': 'The Chevrolet Tahoe is a full-size SUV that offers commanding presence and exceptional capability. With its spacious three-row seating, powerful engine options, and advanced technology features, the Tahoe is perfect for large families or those who need serious towing capacity. It combines luxury with rugged capability.',
  'Honda Accord': 'The Honda Accord is a midsize sedan that sets the standard for reliability, efficiency, and sophistication. With its roomy interior, advanced safety features, and responsive handling, the Accord delivers an exceptional driving experience. It\'s perfect for professionals and families who value quality and dependability.',
  'Toyota Highlander': 'The Toyota Highlander is a three-row SUV that offers the perfect combination of family-friendly features and refined driving dynamics. With comfortable seating for up to eight passengers, excellent safety ratings, and Toyota\'s legendary reliability, the Highlander is ideal for growing families.',
  'Tesla Model 3': 'The Tesla Model 3 is an all-electric sedan that revolutionizes the driving experience with cutting-edge technology and zero emissions. Featuring instant acceleration, advanced autopilot capabilities, and over-the-air updates, the Model 3 represents the future of sustainable transportation with style and performance.',
  'BMW X5': 'The BMW X5 is a luxury SUV that combines dynamic performance with sophisticated comfort. With its powerful engine options, advanced technology features, and premium interior materials, the X5 delivers an exceptional driving experience. Perfect for those who demand both luxury and capability in their vehicle.'
};

async function addDescriptions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Get all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    // Update each vehicle with a description
    for (const vehicle of vehicles) {
      const description = vehicleDescriptions[vehicle.name] || 
        `Experience the perfect blend of style, comfort, and performance with the ${vehicle.name}. This ${vehicle.category} vehicle offers ${vehicle.seats} comfortable seats, ${vehicle.transmission} transmission, and ${vehicle.fuel} power. Available for both rental and purchase, it's an excellent choice for your transportation needs.`;
      
      vehicle.description = description;
      await vehicle.save();
      console.log(`Updated ${vehicle.name} with description`);
    }

    console.log('All vehicles updated with descriptions');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDescriptions();