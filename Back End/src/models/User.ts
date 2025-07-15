import mongoose, { Schema, Document } from 'mongoose';
// import bcrypt from 'bcrypt'; // Temporarily disabled for WSL issues

export interface IUser extends Document {
  _id: string;
  oauthId?: string; // Optional for OAuth users
  email?: string;
  username?: string;
  password?: string; // Optional for password users
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer' | 'reseller';
  phone?: string;
  language: 'en' | 'es';
  currency: 'USD' | 'CRC';
  // Reseller-specific fields
  commissionRate?: number;
  totalCommissions?: number;
  isActive?: boolean;
  canMarkup?: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  oauthId: {
    type: String,
    sparse: true, // Allows null values and ensures uniqueness only for non-null values
    trim: true,
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include in queries by default for security
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'reseller'],
    default: 'customer',
  },
  phone: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    enum: ['en', 'es'],
    default: 'en',
  },
  currency: {
    type: String,
    enum: ['USD', 'CRC'],
    default: 'USD',
  },
  // Reseller-specific fields
  commissionRate: {
    type: Number,
    min: [0, 'Commission rate cannot be negative'],
    max: [50, 'Commission rate cannot exceed 50%'],
  },
  totalCommissions: {
    type: Number,
    default: 0,
    min: [0, 'Total commissions cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  canMarkup: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Custom validation: Either oauthId or password must be present, and either email or username
UserSchema.pre('validate', function(next) {
  if (!this.oauthId && !this.password) {
    next(new Error('Either oauthId or password must be provided'));
  } else if (!this.email && !this.username) {
    next(new Error('Either email or username must be provided'));
  } else {
    next();
  }
});

// Hash password before saving (temporarily disabled)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  // Temporarily store plain text for development (NEVER do this in production!)
  // const salt = await bcrypt.genSalt(10);
  // this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method (temporarily disabled)
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  // Simple plain text comparison for development (NEVER do this in production!)
  return this.password === candidatePassword;
};

// Performance indexes
UserSchema.index({ oauthId: 1 }, { sparse: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ username: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });

// Transform output to match frontend interface
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  userObject.id = userObject._id;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.password; // Never expose password
  delete userObject.oauthId; // Don't expose OAuth ID to frontend
  return userObject;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);