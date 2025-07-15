import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  // Business Hours
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  
  // Holidays and Blackout Dates
  holidays: {
    date: Date;
    name: string;
    description?: string;
    isRecurring: boolean;
    recurringType?: 'yearly' | 'monthly';
  }[];
  
  blackoutDates: {
    startDate: Date;
    endDate: Date;
    reason: string;
    affectedVehicles?: string[]; // Empty means all vehicles
  }[];
  
  // Rental Configuration
  rentalConfig: {
    minRentalDays: number;
    maxRentalDays: number;
    advanceBookingDays: number;
    cutoffHours: number; // Hours before pickup to stop bookings
    defaultCurrency: 'USD' | 'CRC';
    exchangeRate: number; // CRC per USD
    
    // Pricing
    seasonalMultipliers: {
      high: number;
      medium: number;
      low: number;
    };
    
    // Insurance and Fees
    insuranceFee: number;
    serviceFee: number;
    lateFee: number;
    
    // Discounts
    weeklyDiscount: number;
    monthlyDiscount: number;
    
    // Deposit
    securityDeposit: number;
    depositPercentage: number;
  };
  
  // Notification Settings
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    adminEmail: string;
    confirmationTemplate: string;
    reminderTemplate: string;
    cancellationTemplate: string;
  };
  
  // Company Information
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    licenses: string[];
  };
  
  // Terms and Conditions
  terms: {
    version: string;
    content: string;
    lastUpdated: Date;
  };
  
  // System Settings
  systemSettings: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    timeZone: string;
    language: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
  };
  
  updatedAt: Date;
  updatedBy: string;
}

const SettingsSchema: Schema = new Schema({
  businessHours: {
    type: Object,
    default: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
    }
  },
  
  holidays: [{
    date: { type: Date, required: true },
    name: { type: String, required: true },
    description: String,
    isRecurring: { type: Boolean, default: false },
    recurringType: { type: String, enum: ['yearly', 'monthly'] }
  }],
  
  blackoutDates: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    affectedVehicles: [{ type: String }]
  }],
  
  rentalConfig: {
    minRentalDays: { type: Number, default: 1 },
    maxRentalDays: { type: Number, default: 30 },
    advanceBookingDays: { type: Number, default: 365 },
    cutoffHours: { type: Number, default: 2 },
    defaultCurrency: { type: String, enum: ['USD', 'CRC'], default: 'USD' },
    exchangeRate: { type: Number, default: 620 },
    
    seasonalMultipliers: {
      high: { type: Number, default: 1.3 },
      medium: { type: Number, default: 1.1 },
      low: { type: Number, default: 0.9 }
    },
    
    insuranceFee: { type: Number, default: 15 },
    serviceFee: { type: Number, default: 5 },
    lateFee: { type: Number, default: 25 },
    
    weeklyDiscount: { type: Number, default: 0.1 },
    monthlyDiscount: { type: Number, default: 0.2 },
    
    securityDeposit: { type: Number, default: 200 },
    depositPercentage: { type: Number, default: 0.2 }
  },
  
  notifications: {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    adminEmail: { type: String, default: 'admin@vidarentals.com' },
    confirmationTemplate: { type: String, default: 'Thank you for your booking with Vida Rentals!' },
    reminderTemplate: { type: String, default: 'Reminder: Your rental pickup is tomorrow.' },
    cancellationTemplate: { type: String, default: 'Your booking has been cancelled.' }
  },
  
  companyInfo: {
    name: { type: String, default: 'Vida Motors CR' },
    address: { type: String, default: 'San José, Costa Rica' },
    phone: { type: String, default: '+506 2222-3333' },
    email: { type: String, default: 'info@vidarentals.com' },
    website: { type: String, default: 'https://vidarentals.com' },
    taxId: { type: String, default: '3-101-123456' },
    licenses: [{ type: String }]
  },
  
  terms: {
    version: { type: String, default: '1.0' },
    content: { type: String, default: 'Terms and conditions content...' },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  systemSettings: {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'System is under maintenance. Please try again later.' },
    timeZone: { type: String, default: 'America/Costa_Rica' },
    language: { type: String, default: 'en' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' }
  },
  
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true }
});

// Update the updatedAt field on save
SettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
SettingsSchema.index({ updatedAt: -1 });

export default mongoose.model<ISettings>('Settings', SettingsSchema);