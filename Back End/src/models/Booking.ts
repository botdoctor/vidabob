import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  vehicleId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: Date;
  returnDate: Date;
  pickupTime: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  upcharge?: number; // For reseller markups
  upchargePercentage?: number; // For reseller markups
  commission?: number; // For reseller bookings
  commissionRate?: number;
  totalCost: number;
  currency: 'USD' | 'CRC';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  resellerId?: mongoose.Types.ObjectId; // If booked through reseller
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleNew',
    required: [true, 'Vehicle ID is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required'],
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required'],
  },
  pickupTime: {
    type: String,
    required: [true, 'Pickup time is required'],
  },
  totalDays: {
    type: Number,
    required: [true, 'Total days is required'],
    min: [1, 'Booking must be at least 1 day'],
  },
  dailyRate: {
    type: Number,
    required: [true, 'Daily rate is required'],
    min: [0, 'Daily rate cannot be negative'],
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative'],
  },
  upcharge: {
    type: Number,
    min: [0, 'Upcharge cannot be negative'],
  },
  upchargePercentage: {
    type: Number,
    min: [0, 'Upcharge percentage cannot be negative'],
    max: [100, 'Upcharge percentage cannot exceed 100%'],
  },
  commission: {
    type: Number,
    min: [0, 'Commission cannot be negative'],
  },
  commissionRate: {
    type: Number,
    min: [0, 'Commission rate cannot be negative'],
    max: [50, 'Commission rate cannot exceed 50%'],
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative'],
  },
  currency: {
    type: String,
    enum: ['USD', 'CRC'],
    required: [true, 'Currency is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  notes: {
    type: String,
    trim: true,
  },
  resellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for booking queries and real-time updates
BookingSchema.index({ vehicleId: 1, pickupDate: 1, returnDate: 1 }); // Vehicle availability checks
BookingSchema.index({ userId: 1, status: 1 }); // User's booking history
BookingSchema.index({ resellerId: 1 }); // Reseller bookings
BookingSchema.index({ status: 1, createdAt: -1 }); // Status filtering with date sorting
BookingSchema.index({ pickupDate: 1, returnDate: 1 }); // Date range queries
BookingSchema.index({ createdAt: -1 }); // Recent bookings

// Validate that return date is after pickup date
BookingSchema.pre('save', function(next) {
  if (this.returnDate <= this.pickupDate) {
    next(new Error('Return date must be after pickup date'));
  } else {
    next();
  }
});

// Method to check for booking conflicts
BookingSchema.statics.hasConflict = async function(
  vehicleId: mongoose.Types.ObjectId,
  pickupDate: Date,
  returnDate: Date,
  excludeBookingId?: mongoose.Types.ObjectId
) {
  const query: any = {
    vehicleId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return !!conflictingBooking;
};

// Transform output to match frontend interface
BookingSchema.methods.toJSON = function() {
  const bookingObject = this.toObject();
  bookingObject.id = bookingObject._id;
  delete bookingObject._id;
  delete bookingObject.__v;
  
  // Transform dates to ISO strings
  bookingObject.pickupDate = bookingObject.pickupDate.toISOString().split('T')[0];
  bookingObject.returnDate = bookingObject.returnDate.toISOString().split('T')[0];
  
  // Transform ObjectIds to strings
  bookingObject.vehicleId = bookingObject.vehicleId.toString();
  bookingObject.userId = bookingObject.userId.toString();
  if (bookingObject.resellerId) {
    bookingObject.resellerId = bookingObject.resellerId.toString();
  }
  
  return bookingObject;
};

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);