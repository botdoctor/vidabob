import mongoose, { Schema, Document } from 'mongoose';

// Sub-schemas for nested objects
const EngineSchema = new Schema({
  fuel: {
    type: String,
    enum: ['gasoline', 'diesel', 'hybrid', 'electric', 'hydrogen'],
    required: true,
  },
  displacement: {
    type: Number,
    min: 0,
  },
  horsepower: {
    type: Number,
    min: 0,
  },
  fuelCapacity: {
    type: Number,
    min: [0, 'Fuel capacity cannot be negative'],
    max: [200, 'Fuel capacity cannot exceed 200 gallons'],
  },
  mpg: {
    city: { type: Number, min: 0 },
    highway: { type: Number, min: 0 },
    combined: { type: Number, min: 0 },
  },
}, { _id: false });

const ColorSchema = new Schema({
  exterior: {
    type: String,
    required: true,
  },
  interior: {
    type: String,
  },
}, { _id: false });

const BookingDateRangeSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
}, { _id: false });

// Main Vehicle interface
export interface IVehicle extends Document {
  _id: string;
  
  // Core Information
  make: string;
  vehicleModel: string;
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
  location?: string;
  
  // Rental-Specific
  bookedDates: {
    start: Date;
    end: Date;
    bookingId: mongoose.Types.ObjectId;
  }[];
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
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  // Core Information
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true,
    index: true,
  },
  vehicleModel: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
    index: true,
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: [1900, 'Year must be 1900 or later'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future'],
    index: true,
  },
  vin: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'motorcycle'],
    required: [true, 'Vehicle category is required'],
    index: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['sale', 'rental', 'both'],
    required: [true, 'Vehicle type is required'],
    index: true,
  },
  
  // Pricing
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    index: true,
  },
  rentalPrice: {
    type: Number,
    min: [0, 'Rental price cannot be negative'],
    index: true,
  },
  salePriceColones: {
    type: Number,
    min: [0, 'Sale price in colones cannot be negative'],
  },
  rentalPriceColones: {
    type: Number,
    min: [0, 'Rental price in colones cannot be negative'],
  },
  minRentalPrice: {
    type: Number,
    min: [0, 'Minimum rental price cannot be negative'],
  },
  
  // Technical Specifications
  engine: {
    type: EngineSchema,
    required: [true, 'Engine information is required'],
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'cvt'],
    required: [true, 'Transmission type is required'],
  },
  drivetrain: {
    type: String,
    enum: ['fwd', 'rwd', 'awd', '4wd'],
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Vehicle must have at least 1 seat'],
    max: [50, 'Vehicle cannot have more than 50 seats'],
  },
  doors: {
    type: Number,
    min: [1, 'Vehicle must have at least 1 door'],
    max: [10, 'Vehicle cannot have more than 10 doors'],
  },
  towingCapacity: {
    type: Number,
    min: [0, 'Towing capacity cannot be negative'],
    max: [50000, 'Towing capacity cannot exceed 50,000 pounds'],
  },
  
  // Physical Attributes
  mileage: {
    type: Number,
    required: [true, 'Vehicle mileage is required'],
    min: [0, 'Mileage cannot be negative'],
    index: true,
  },
  color: {
    type: ColorSchema,
    required: [true, 'Vehicle color is required'],
  },
  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'poor'],
    required: [true, 'Vehicle condition is required'],
  },
  images: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    },
  },
  primaryImage: {
    type: String,
    required: [true, 'Primary image is required'],
  },
  
  // Features & Equipment
  features: {
    type: [String],
    default: [],
  },
  safetyFeatures: {
    type: [String],
    default: [],
  },
  techFeatures: {
    type: [String],
    default: [],
  },
  packages: {
    type: [String],
    default: [],
  },
  
  // Availability & Status
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'maintenance', 'featured'],
    default: 'available',
    index: true,
  },
  available: {
    type: Boolean,
    default: true,
    index: true,
  },
  isFeatures: {
    type: Boolean,
    default: false,
    index: true,
  },
  location: {
    type: String,
    trim: true,
  },
  
  // Rental-Specific
  bookedDates: {
    type: [BookingDateRangeSchema],
    default: [],
  },
  minRentalDays: {
    type: Number,
    min: [1, 'Minimum rental days must be at least 1'],
  },
  maxRentalDays: {
    type: Number,
    min: [1, 'Maximum rental days must be at least 1'],
  },
  
  // Metadata
  description: {
    type: String,
    required: [true, 'Vehicle description is required'],
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  createdBy: {
    type: String,
    trim: true,
  },
  updatedBy: {
    type: String,
    trim: true,
  },
  
  // SEO & Marketing
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Validation: At least one price must be provided
VehicleSchema.pre('validate', function() {
  if (this.type === 'sale' && !this.salePrice) {
    this.invalidate('salePrice', 'Sale price is required for sale vehicles');
  }
  if (this.type === 'rental' && !this.rentalPrice) {
    this.invalidate('rentalPrice', 'Rental price is required for rental vehicles');
  }
  if (this.type === 'both' && !this.salePrice && !this.rentalPrice) {
    this.invalidate('salePrice', 'At least one of sale price or rental price is required');
  }
});

// Pre-save middleware to auto-generate slug
VehicleSchema.pre('save', function() {
  if (!this.slug) {
    this.slug = `${this.year}-${this.make}-${this.vehicleModel}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Set primary image as first image if not set
  if (!this.primaryImage && this.images.length > 0) {
    this.primaryImage = this.images[0];
  }
  
  // Auto-set available based on status
  this.available = ['available', 'featured'].includes(this.status);
});

// Performance indexes
VehicleSchema.index({ make: 1, vehicleModel: 1, year: 1 }); // Vehicle identification
VehicleSchema.index({ category: 1, type: 1, status: 1 }); // Filtering
VehicleSchema.index({ salePrice: 1, rentalPrice: 1 }); // Price sorting
VehicleSchema.index({ 'bookedDates.start': 1, 'bookedDates.end': 1 }); // Date range queries
VehicleSchema.index({ tags: 1 }); // Tag search
VehicleSchema.index({ available: 1, status: 1, isFeatures: 1 }); // Common queries

// Text search index
VehicleSchema.index({
  make: 'text',
  vehicleModel: 'text',
  description: 'text',
  features: 'text',
  tags: 'text'
});

// Method to check if vehicle is available for a date range
VehicleSchema.methods.isAvailableForDateRange = function(startDate: Date, endDate: Date): boolean {
  if (!this.available || this.type === 'sale') return false;

  return !this.bookedDates.some((booking: any) => {
    return startDate <= booking.end && endDate >= booking.start;
  });
};

// Static method to find available vehicles for rental
VehicleSchema.statics.findAvailableForRental = function(startDate: Date, endDate: Date, filters = {}) {
  const query = {
    available: true,
    type: { $in: ['rental', 'both'] },
    ...filters,
    $nor: [
      {
        'bookedDates': {
          $elemMatch: {
            start: { $lte: endDate },
            end: { $gte: startDate }
          }
        }
      }
    ]
  };
  
  return this.find(query);
};

// Transform output to match API format
VehicleSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    
    // Transform bookedDates for frontend compatibility
    if (ret.bookedDates && ret.bookedDates.length > 0) {
      ret.bookedDates = ret.bookedDates.map((booking: any) => ({
        start: booking.start.toISOString().split('T')[0],
        end: booking.end.toISOString().split('T')[0],
        bookingId: booking.bookingId.toString(),
      }));
    }
    
    return ret;
  }
});

export default mongoose.models.VehicleNew || mongoose.model<IVehicle>('VehicleNew', VehicleSchema);