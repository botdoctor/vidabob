import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  _id: string;
  vehicleId: mongoose.Types.ObjectId;
  salePrice: number;
  soldDate: Date;
  soldBy: string; // User ID who marked it as sold
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod?: 'cash' | 'finance' | 'credit' | 'other';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleNew',
    required: [true, 'Vehicle ID is required'],
    index: true,
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative'],
  },
  soldDate: {
    type: Date,
    required: [true, 'Sold date is required'],
    default: Date.now,
    index: true,
  },
  soldBy: {
    type: String,
    required: [true, 'Sold by user ID is required'],
  },
  customerName: {
    type: String,
    trim: true,
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'finance', 'credit', 'other'],
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for analytics queries
SaleSchema.index({ soldDate: 1, salePrice: 1 });
SaleSchema.index({ soldBy: 1, soldDate: 1 });

// Transform output
SaleSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);