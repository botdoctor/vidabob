export interface Vehicle {
  id: string;
  
  // Core Information
  make: string;
  model: string;
  year: number;
  vin?: string;
  
  // Categorization
  category: 'sedan' | 'suv' | 'truck' | 'coupe' | 'hatchback' | 'convertible' | 'van' | 'motorcycle';
  subcategory?: string;
  type: 'sale' | 'rental' | 'both';
  
  // Pricing
  salePrice?: number;
  rentalPrice?: number;
  salePriceColones?: number;
  rentalPriceColones?: number;
  minRentalPrice?: number;
  
  // Technical Specifications
  engine: {
    fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'hydrogen';
    displacement?: number;
    horsepower?: number;
    fuelCapacity?: number;
    mpg?: {
      city?: number;
      highway?: number;
      combined?: number;
    };
  };
  transmission: 'manual' | 'automatic' | 'cvt';
  drivetrain?: 'fwd' | 'rwd' | 'awd' | '4wd';
  towingCapacity?: number;
  seats: number;
  doors?: number;
  
  // Physical Attributes
  mileage: number;
  color: {
    exterior: string;
    interior?: string;
  };
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  primaryImage: string;
  
  // Features & Equipment
  features: string[];
  safetyFeatures?: string[];
  techFeatures?: string[];
  packages?: string[];
  
  // Availability & Status
  status: 'available' | 'sold' | 'reserved' | 'maintenance' | 'featured';
  available: boolean;
  isFeatures: boolean;
  isFeatured?: boolean; // Alias for isFeatures (for code clarity)
  location?: string;
  
  // Rental-Specific
  bookedDates?: Array<{
    start: string;
    end: string;
    bookingId: string;
  }>;
  minRentalDays?: number;
  maxRentalDays?: number;
  
  // Metadata
  description: string;
  notes?: string;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
  
  // SEO & Marketing
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}