import mongoose from 'mongoose';
import User from '../models/User';
import Vehicle from '../models/VehicleNew';
import Booking from '../models/Booking';
import connectDB from '../utils/database';

const seedUsers = async () => {
  console.log('Seeding users...');
  
  const users = [
    {
      email: 'admin@vidarentals.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      language: 'en',
      currency: 'USD',
      isActive: true,
    },
    {
      email: 'reseller@vidarentals.com',
      password: 'reseller123',
      firstName: 'John',
      lastName: 'Reseller',
      role: 'reseller',
      phone: '8555-1234',
      language: 'en',
      currency: 'USD',
      commissionRate: 15,
      totalCommissions: 0,
      isActive: true,
      canMarkup: true,
    },
    {
      email: 'customer@vidarentals.com',
      password: 'customer123',
      firstName: 'Jane',
      lastName: 'Customer',
      role: 'customer',
      phone: '8555-5678',
      language: 'en',
      currency: 'USD',
      isActive: true,
    },
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email} (${userData.role})`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }
};

const seedVehicles = async () => {
  console.log('Seeding vehicles...');
  
  // Clear existing vehicles first
  await Vehicle.deleteMany({});
  console.log('Cleared existing vehicles');
  
  const vehicles = [
    {
      make: 'Toyota',
      vehicleModel: 'Yaris',
      year: 2024,
      category: 'hatchback',
      type: 'rental',
      rentalPrice: 35,
      rentalPriceColones: 20000,
      minRentalPrice: 30,
      engine: {
        fuel: 'gasoline',
        displacement: 1.5,
        horsepower: 106,
        fuelCapacity: 11.6,
        mpg: {
          city: 32,
          highway: 40,
          combined: 36
        }
      },
      transmission: 'manual',
      drivetrain: 'fwd',
      seats: 5,
      doors: 4,
      mileage: 15000,
      color: {
        exterior: 'Silver',
        interior: 'Black'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      features: ['Air Conditioning', 'Bluetooth', 'USB Port', 'Cruise Control'],
      safetyFeatures: ['ABS', 'Airbags', 'Stability Control'],
      description: 'Compact and fuel-efficient hatchback perfect for city driving',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Honda',
      vehicleModel: 'Civic',
      year: 2024,
      category: 'sedan',
      type: 'both',
      salePrice: 28000,
      rentalPrice: 45,
      salePriceColones: 16800000,
      rentalPriceColones: 25000,
      minRentalPrice: 40,
      engine: {
        fuel: 'gasoline',
        displacement: 2.0,
        horsepower: 158,
        fuelCapacity: 12.4,
        mpg: {
          city: 31,
          highway: 40,
          combined: 35
        }
      },
      transmission: 'automatic',
      drivetrain: 'fwd',
      seats: 5,
      doors: 4,
      mileage: 12000,
      color: {
        exterior: 'Blue',
        interior: 'Gray'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      features: ['Apple CarPlay', 'Android Auto', 'Lane Keeping Assist', 'Adaptive Cruise Control'],
      safetyFeatures: ['Honda Sensing', 'Blind Spot Monitoring', 'Collision Mitigation'],
      techFeatures: ['7-inch Display', 'Smartphone Integration'],
      description: 'Popular compact sedan with excellent fuel economy and reliability',
      available: true,
      isFeatures: true,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Toyota',
      vehicleModel: 'RAV4',
      year: 2024,
      category: 'suv',
      type: 'both',
      salePrice: 35000,
      rentalPrice: 65,
      salePriceColones: 21000000,
      rentalPriceColones: 35000,
      minRentalPrice: 60,
      engine: {
        fuel: 'gasoline',
        displacement: 2.5,
        horsepower: 203,
        fuelCapacity: 14.5,
        mpg: {
          city: 27,
          highway: 35,
          combined: 30
        }
      },
      transmission: 'automatic',
      drivetrain: 'awd',
      towingCapacity: 3500,
      seats: 5,
      doors: 4,
      mileage: 8000,
      color: {
        exterior: 'White',
        interior: 'Black'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      features: ['Roof Rails', 'Power Liftgate', 'Heated Seats', 'Dual Zone Climate Control'],
      safetyFeatures: ['Toyota Safety Sense 2.0', 'Blind Spot Monitor', 'Rear Cross Traffic Alert'],
      techFeatures: ['8-inch Touchscreen', 'Wireless Charging', 'Premium Audio'],
      description: 'Versatile compact SUV with all-wheel drive and excellent safety ratings',
      available: true,
      isFeatures: true,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'BMW',
      vehicleModel: 'X3',
      year: 2024,
      category: 'suv',
      type: 'sale',
      salePrice: 55000,
      salePriceColones: 33000000,
      engine: {
        fuel: 'gasoline',
        displacement: 2.0,
        horsepower: 248,
        fuelCapacity: 17.2,
        mpg: {
          city: 25,
          highway: 34,
          combined: 29
        }
      },
      transmission: 'automatic',
      drivetrain: 'awd',
      towingCapacity: 4400,
      seats: 5,
      doors: 4,
      mileage: 5000,
      color: {
        exterior: 'Black',
        interior: 'Cognac Leather'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      features: ['Panoramic Sunroof', 'Leather Seats', 'Navigation System', 'Harman Kardon Sound'],
      safetyFeatures: ['Active Protection', 'Lane Departure Warning', 'Automatic Emergency Braking'],
      techFeatures: ['iDrive 7.0', 'Gesture Control', 'Wireless Phone Charging'],
      packages: ['Premium Package', 'Driving Assistance Package'],
      description: 'Luxury compact SUV with cutting-edge technology and performance',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Nissan',
      vehicleModel: 'Sentra',
      year: 2023,
      category: 'sedan',
      type: 'rental',
      rentalPrice: 40,
      rentalPriceColones: 22000,
      minRentalPrice: 35,
      engine: {
        fuel: 'gasoline',
        displacement: 2.0,
        horsepower: 149,
        fuelCapacity: 12.4,
        mpg: {
          city: 29,
          highway: 39,
          combined: 33
        }
      },
      transmission: 'cvt',
      drivetrain: 'fwd',
      seats: 5,
      doors: 4,
      mileage: 20000,
      color: {
        exterior: 'Red',
        interior: 'Charcoal'
      },
      condition: 'good',
      images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
      features: ['Remote Start', 'Keyless Entry', 'Automatic Climate Control'],
      safetyFeatures: ['Nissan Safety Shield 360', 'Automatic Emergency Braking'],
      description: 'Comfortable compact sedan with great fuel economy',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Hyundai',
      vehicleModel: 'Tucson',
      year: 2024,
      category: 'suv',
      type: 'both',
      salePrice: 32000,
      rentalPrice: 60,
      salePriceColones: 19200000,
      rentalPriceColones: 33000,
      minRentalPrice: 55,
      engine: {
        fuel: 'gasoline',
        displacement: 2.5,
        horsepower: 187,
        fuelCapacity: 14.3,
        mpg: {
          city: 26,
          highway: 33,
          combined: 29
        }
      },
      transmission: 'automatic',
      drivetrain: 'awd',
      towingCapacity: 2000,
      seats: 5,
      doors: 4,
      mileage: 10000,
      color: {
        exterior: 'Deep Sea Blue',
        interior: 'Gray'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&h=300&fit=crop',
      features: ['Hands-Free Liftgate', 'Heated Steering Wheel', 'Blue Link Connected Services'],
      safetyFeatures: ['Highway Driving Assist', 'Forward Collision-Avoidance', 'Blind-Spot Monitoring'],
      techFeatures: ['10.25-inch Touchscreen', 'Digital Key', 'Bose Premium Audio'],
      description: 'Modern compact SUV with bold styling and advanced technology',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Tesla',
      vehicleModel: 'Model 3',
      year: 2024,
      category: 'sedan',
      type: 'both',
      salePrice: 45000,
      rentalPrice: 120,
      salePriceColones: 27000000,
      rentalPriceColones: 70000,
      minRentalPrice: 110,
      engine: {
        fuel: 'electric',
        horsepower: 283,
        mpg: {
          city: 138,
          highway: 120,
          combined: 129
        }
      },
      transmission: 'automatic',
      drivetrain: 'rwd',
      seats: 5,
      doors: 4,
      mileage: 3000,
      color: {
        exterior: 'Pearl White',
        interior: 'Black Vegan Leather'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      features: ['Autopilot', 'Over-the-Air Updates', 'Glass Roof', 'Supercharger Network Access'],
      safetyFeatures: ['Enhanced Autopilot', 'Emergency Braking', '360-Degree Cameras'],
      techFeatures: ['15-inch Touchscreen', 'Premium Connectivity', 'Theater Mode'],
      description: 'All-electric sedan with cutting-edge technology and impressive range',
      available: true,
      isFeatures: true,
      status: 'featured',
      bookedDates: [],
    },
    {
      make: 'Chevrolet',
      vehicleModel: 'Spark',
      year: 2023,
      category: 'hatchback',
      type: 'rental',
      rentalPrice: 30,
      rentalPriceColones: 18000,
      minRentalPrice: 25,
      engine: {
        fuel: 'gasoline',
        displacement: 1.4,
        horsepower: 98,
        fuelCapacity: 9.0,
        mpg: {
          city: 30,
          highway: 38,
          combined: 33
        }
      },
      transmission: 'cvt',
      drivetrain: 'fwd',
      seats: 4,
      doors: 4,
      mileage: 25000,
      color: {
        exterior: 'Orange',
        interior: 'Black'
      },
      condition: 'good',
      images: ['https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
      features: ['Apple CarPlay', 'Android Auto', 'WiFi Hotspot'],
      safetyFeatures: ['10 Airbags', 'StabiliTrak', 'Rear Vision Camera'],
      description: 'Ultra-compact city car with surprising interior space',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Ford',
      vehicleModel: 'Mustang',
      year: 2024,
      category: 'coupe',
      type: 'both',
      salePrice: 42000,
      rentalPrice: 110,
      salePriceColones: 25200000,
      rentalPriceColones: 65000,
      minRentalPrice: 100,
      engine: {
        fuel: 'gasoline',
        displacement: 5.0,
        horsepower: 450,
        fuelCapacity: 16.0,
        mpg: {
          city: 15,
          highway: 24,
          combined: 18
        }
      },
      transmission: 'manual',
      drivetrain: 'rwd',
      seats: 4,
      doors: 2,
      mileage: 6000,
      color: {
        exterior: 'Race Red',
        interior: 'Black Leather'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      features: ['Performance Package', 'Active Valve Exhaust', 'Track Apps'],
      safetyFeatures: ['Pre-Collision Assist', 'Lane Keeping System'],
      techFeatures: ['SYNC 4', '12-inch Digital Cluster', 'B&O Sound System'],
      packages: ['GT Performance Package'],
      description: 'Iconic American muscle car with modern performance and technology',
      available: true,
      isFeatures: true,
      status: 'featured',
      bookedDates: [],
    },
    {
      make: 'Jeep',
      vehicleModel: 'Wrangler',
      year: 2024,
      category: 'suv',
      type: 'rental',
      rentalPrice: 85,
      rentalPriceColones: 48000,
      minRentalPrice: 80,
      engine: {
        fuel: 'gasoline',
        displacement: 3.6,
        horsepower: 285,
        fuelCapacity: 21.5,
        mpg: {
          city: 17,
          highway: 25,
          combined: 20
        }
      },
      transmission: 'automatic',
      drivetrain: '4wd',
      towingCapacity: 3500,
      seats: 5,
      doors: 4,
      mileage: 12000,
      color: {
        exterior: 'Firecracker Red',
        interior: 'Black'
      },
      condition: 'good',
      images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      features: ['Removable Top', 'Removable Doors', 'Rock-Trac 4x4 System', 'Skid Plates'],
      safetyFeatures: ['Roll Bars', 'Hill Start Assist', 'Electronic Stability Control'],
      description: 'Legendary off-road capability in an iconic design',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Kia',
      vehicleModel: 'Rio',
      year: 2023,
      category: 'sedan',
      type: 'rental',
      rentalPrice: 32,
      rentalPriceColones: 19000,
      minRentalPrice: 28,
      engine: {
        fuel: 'gasoline',
        displacement: 1.6,
        horsepower: 120,
        fuelCapacity: 11.9,
        mpg: {
          city: 33,
          highway: 41,
          combined: 36
        }
      },
      transmission: 'cvt',
      drivetrain: 'fwd',
      seats: 5,
      doors: 4,
      mileage: 18000,
      color: {
        exterior: 'Silky Silver',
        interior: 'Black'
      },
      condition: 'good',
      images: ['https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
      features: ['8-inch Display', 'Rear Camera', 'Wireless Apple CarPlay'],
      safetyFeatures: ['Forward Collision Avoidance', 'Lane Keeping Assist'],
      description: 'Affordable subcompact with surprising features and great fuel economy',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
    {
      make: 'Mazda',
      vehicleModel: 'CX-5',
      year: 2024,
      category: 'suv',
      type: 'both',
      salePrice: 38000,
      rentalPrice: 70,
      salePriceColones: 22800000,
      rentalPriceColones: 40000,
      minRentalPrice: 65,
      engine: {
        fuel: 'gasoline',
        displacement: 2.5,
        horsepower: 227,
        fuelCapacity: 15.3,
        mpg: {
          city: 24,
          highway: 30,
          combined: 26
        }
      },
      transmission: 'automatic',
      drivetrain: 'awd',
      towingCapacity: 2000,
      seats: 5,
      doors: 4,
      mileage: 7000,
      color: {
        exterior: 'Machine Gray Metallic',
        interior: 'Parchment Leather'
      },
      condition: 'excellent',
      images: ['https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&h=300&fit=crop'],
      primaryImage: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&h=300&fit=crop',
      features: ['Ventilated Seats', 'Head-Up Display', 'Power Liftgate', 'Adaptive LED Headlights'],
      safetyFeatures: ['i-Activsense Safety Suite', 'Smart Brake Support', 'Traffic Sign Recognition'],
      techFeatures: ['10.25-inch Display', 'Bose Premium Audio', '360-View Monitor'],
      packages: ['Premium Plus Package'],
      description: 'Premium compact SUV with refined driving dynamics and upscale interior',
      available: true,
      isFeatures: false,
      status: 'available',
      bookedDates: [],
    },
  ];

  for (const vehicleData of vehicles) {
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    console.log(`Created vehicle: ${vehicleData.make} ${vehicleData.vehicleModel}`);
  }
};

const seedBookings = async () => {
  console.log('Seeding bookings...');
  
  // Clear existing bookings first
  await Booking.deleteMany({});
  console.log('Cleared existing bookings');
  
  // Get some vehicles and users for booking references
  const vehicles = await Vehicle.find().limit(5);
  const users = await User.find();
  
  if (vehicles.length === 0 || users.length === 0) {
    console.log('No vehicles or users found, skipping bookings');
    return;
  }
  
  const bookings = [
    {
      vehicleId: vehicles[0]._id,
      userId: users[0]._id,
      customerName: 'Carlos Rodriguez',
      customerEmail: 'carlos@example.com',
      customerPhone: '8888-1234',
      pickupDate: new Date('2025-07-15'),
      returnDate: new Date('2025-07-18'),
      pickupTime: '09:00',
      totalDays: 3,
      dailyRate: vehicles[0].rentalPrice,
      subtotal: vehicles[0].rentalPrice * 3,
      totalCost: vehicles[0].rentalPrice * 3,
      currency: 'USD',
      status: 'confirmed',
      notes: 'Airport pickup requested',
    },
    {
      vehicleId: vehicles[1]._id,
      userId: users[1]._id,
      customerName: 'Maria Gonzalez',
      customerEmail: 'maria@example.com',
      customerPhone: '8888-5678',
      pickupDate: new Date('2025-07-20'),
      returnDate: new Date('2025-07-25'),
      pickupTime: '14:00',
      totalDays: 5,
      dailyRate: vehicles[1].rentalPrice,
      subtotal: vehicles[1].rentalPrice * 5,
      totalCost: vehicles[1].rentalPrice * 5,
      currency: 'USD',
      status: 'pending',
      notes: 'Business trip rental',
    },
    {
      vehicleId: vehicles[2]._id,
      userId: users[2]._id,
      customerName: 'Jose Martinez',
      customerEmail: 'jose@example.com',
      customerPhone: '8888-9012',
      pickupDate: new Date('2025-07-10'),
      returnDate: new Date('2025-07-12'),
      pickupTime: '10:30',
      totalDays: 2,
      dailyRate: vehicles[2].rentalPrice,
      subtotal: vehicles[2].rentalPrice * 2,
      totalCost: vehicles[2].rentalPrice * 2,
      currency: 'USD',
      status: 'completed',
      notes: 'Weekend getaway',
    },
  ];

  for (const bookingData of bookings) {
    const booking = new Booking(bookingData);
    await booking.save();
    console.log(`Created booking for: ${bookingData.customerName}`);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await seedUsers();
    await seedVehicles();
    await seedBookings();

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;