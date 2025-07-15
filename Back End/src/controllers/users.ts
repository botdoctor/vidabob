import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';

export const getAllUsers = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can view all users
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can view all users',
      });
      return;
    }

    const { role, search } = req.query;
    
    let query: any = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      users: users.map(user => (user as any).toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
};

export const getUserById = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile (except admin)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own profile',
      });
      return;
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist',
      });
      return;
    }

    res.json({
      user: (user as any).toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
};

export const updateUser = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Users can only update their own profile (except admin)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own profile',
      });
      return;
    }

    // Remove sensitive fields from updates if not admin
    if (req.user.role !== 'admin') {
      delete updates.role;
      delete updates.commissionRate;
      delete updates.totalCommissions;
    }

    // Don't allow password updates through this route
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist',
      });
      return;
    }

    res.json({
      message: 'User updated successfully',
      user: (user as any).toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message,
    });
  }
};

export const deleteUser = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Only admin can delete users
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can delete users',
      });
      return;
    }

    // Check if user has active bookings
    const activeBookings = await Booking.countDocuments({
      userId: id,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (activeBookings > 0) {
      res.status(400).json({
        error: 'Cannot delete user',
        message: 'User has active bookings. Cancel bookings first.',
      });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist',
      });
      return;
    }

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message,
    });
  }
};

export const getResellers = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can view resellers
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can view resellers',
      });
      return;
    }

    const resellers = await User.find({ role: 'reseller' })
      .select('-password')
      .sort({ totalCommissions: -1 });

    res.json({
      resellers: resellers.map(reseller => (reseller as any).toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch resellers',
      message: error.message,
    });
  }
};

export const updateResellerCommission = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;
    
    console.log('updateResellerCommission called with:', { id, commissionRate, body: req.body });

    // Validate commission rate
    if (commissionRate === undefined || commissionRate === null) {
      res.status(400).json({
        error: 'Invalid request',
        message: 'Commission rate is required',
      });
      return;
    }
    
    const rate = Number(commissionRate);
    console.log('Updating commission rate for reseller:', id, 'from', commissionRate, 'to', rate);
    
    if (isNaN(rate) || rate < 0 || rate > 50) {
      res.status(400).json({
        error: 'Invalid commission rate',
        message: 'Commission rate must be a number between 0 and 50',
      });
      return;
    }

    // Only admin can update commission rates
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can update commission rates',
      });
      return;
    }

    const reseller = await User.findOne({ _id: id, role: 'reseller' });
    if (!reseller) {
      res.status(404).json({
        error: 'Reseller not found',
        message: 'Reseller with this ID does not exist',
      });
      return;
    }

    reseller.commissionRate = rate;
    await reseller.save();
    
    console.log('Commission rate updated successfully for reseller:', reseller.username, 'new rate:', rate);

    res.json({
      message: 'Commission rate updated successfully',
      reseller: (reseller as any).toJSON(),
    });
  } catch (error: any) {
    console.error('Error in updateResellerCommission:', error);
    res.status(500).json({
      error: 'Failed to update commission rate',
      message: error.message,
      details: error.toString()
    });
  }
};

export const getUserBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Users can only view their own bookings (except admin)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own bookings',
      });
      return;
    }

    const bookings = await Booking.find({ userId: id })
      .populate('vehicleId', 'name category image')
      .sort({ createdAt: -1 });

    res.json({
      bookings: bookings.map(booking => (booking as any).toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch user bookings',
      message: error.message,
    });
  }
};

export const getResellerBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Resellers can only view their own bookings, admin can view any
    if (req.user.role !== 'admin' && req.user.id !== id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own bookings',
      });
      return;
    }

    const bookings = await Booking.find({ resellerId: id })
      .populate('vehicleId', 'name category image')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      bookings: bookings.map(booking => (booking as any).toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch reseller bookings',
      message: error.message,
    });
  }
};

export const createReseller = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can create resellers
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can create resellers',
      });
      return;
    }

    const { username, firstName, lastName, email, password, commissionRate } = req.body;

    // Validate required fields
    if (!username || !firstName || !lastName || !password) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, firstName, lastName, and password are required',
      });
      return;
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (existingUser) {
      res.status(400).json({
        error: 'User already exists',
        message: 'A user with this username or email already exists',
      });
      return;
    }

    // Create new reseller
    const reseller = new User({
      username: username.toLowerCase(),
      firstName,
      lastName,
      email: email?.toLowerCase(),
      password, // Will be hashed by the pre-save hook
      role: 'reseller',
      commissionRate: commissionRate || 10, // Default 10%
      totalCommissions: 0,
      isActive: true,
      canMarkup: true,
    });

    await reseller.save();

    res.status(201).json({
      message: 'Reseller created successfully',
      reseller: (reseller as any).toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create reseller',
      message: error.message,
    });
  }
};

export const getResellerDashboardStats = async (req: any, res: Response): Promise<void> => {
  try {
    const resellerId = req.user.id;
    
    // Get reseller info
    const reseller = await User.findById(resellerId).select('-password');
    if (!reseller || reseller.role !== 'reseller') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only resellers can access this data',
      });
      return;
    }

    // Get all bookings made by this reseller
    const allBookings = await Booking.find({ resellerId })
      .populate('vehicleId', 'make vehicleModel year')
      .populate('userId', 'firstName lastName email');

    // Calculate stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);

    // Total sales count
    const totalSales = allBookings.filter(b => b.status === 'completed').length;
    const salesThisMonth = allBookings.filter(b => 
      b.status === 'completed' && 
      new Date(b.createdAt) >= thisMonthStart
    ).length;

    // Active customers (unique customers with active bookings)
    const activeCustomers = new Set(
      allBookings
        .filter(b => ['pending', 'confirmed'].includes(b.status))
        .map(b => b.userId?.toString())
    ).size;
    
    const customersThisWeek = new Set(
      allBookings
        .filter(b => new Date(b.createdAt) >= thisWeekStart)
        .map(b => b.userId?.toString())
    ).size;

    // Commission earned
    const totalCommissionEarned = allBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.commission || 0), 0);
    
    const commissionThisMonth = allBookings
      .filter(b => 
        b.status === 'completed' && 
        new Date(b.createdAt) >= thisMonthStart
      )
      .reduce((sum, b) => sum + (b.commission || 0), 0);

    // Recent activity (last 10 activities)
    const recentActivity = allBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(booking => ({
        id: booking._id,
        type: booking.status === 'completed' ? 'sale' : 'booking',
        description: `${booking.status === 'completed' ? 'Sold' : 'Booked'} ${booking.vehicleId?.make || ''} ${booking.vehicleId?.vehicleModel || ''} to ${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`,
        time: booking.createdAt,
        amount: booking.commission ? `+$${booking.commission.toFixed(2)}` : null
      }));

    // Performance rating (placeholder - could be based on actual metrics)
    const performanceRating = 4.5; // This could be calculated based on various factors

    res.json({
      stats: {
        totalSales: {
          value: totalSales,
          change: `+${salesThisMonth} this month`
        },
        activeCustomers: {
          value: activeCustomers,
          change: `+${customersThisWeek} this week`
        },
        commissionEarned: {
          value: `$${totalCommissionEarned.toFixed(2)}`,
          change: `+$${commissionThisMonth.toFixed(2)} this month`
        },
        performanceRating: {
          value: `${performanceRating}/5`,
          change: '+0.2 improvement' // This could be calculated
        }
      },
      recentActivity,
      reseller: {
        name: `${reseller.firstName} ${reseller.lastName}`,
        commissionRate: reseller.commissionRate
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      message: error.message,
    });
  }
};