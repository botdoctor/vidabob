import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Vehicle from '../models/VehicleNew';
import User from '../models/User';

export const getAllBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const { status, userId, vehicleId, startDate, endDate } = req.query;
    
    let query: any = {};
    
    // Admin can see all bookings, users can only see their own
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    } else if (userId) {
      query.userId = userId;
    }
    
    if (status) query.status = status;
    if (vehicleId) query.vehicleId = vehicleId;
    
    if (startDate && endDate) {
      query.pickupDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const bookings = await Booking.find(query)
      .populate('vehicleId', 'make vehicleModel year category primaryImage')
      .populate('userId', 'firstName lastName email')
      .populate('resellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      bookings: bookings.map(booking => (booking as any).toJSON()),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error.message,
    });
  }
};

export const getBookingById = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('vehicleId', 'make vehicleModel year category primaryImage')
      .populate('userId', 'firstName lastName email')
      .populate('resellerId', 'firstName lastName email');

    if (!booking) {
      res.status(404).json({
        error: 'Booking not found',
        message: 'Booking with this ID does not exist',
      });
      return;
    }

    // Users can only see their own bookings (except admin)
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own bookings',
      });
      return;
    }

    res.json({
      booking: (booking as any).toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch booking',
      message: error.message,
    });
  }
};

export const createPublicBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingData = req.body;
    
    // Validate vehicle exists
    const vehicle = await Vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      res.status(404).json({
        error: 'Vehicle not found',
        message: 'Vehicle with this ID does not exist',
      });
      return;
    }

    // Check if vehicle is available for the requested dates
    const pickupDate = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    
    if (!(vehicle as any).isAvailableForDateRange(pickupDate, returnDate)) {
      res.status(400).json({
        error: 'Vehicle not available',
        message: 'Vehicle is not available for the selected dates',
      });
      return;
    }

    // Check for booking conflicts
    const hasConflict = await (Booking as any).hasConflict(
      bookingData.vehicleId,
      pickupDate,
      returnDate
    );

    if (hasConflict) {
      res.status(400).json({
        error: 'Booking conflict',
        message: 'Vehicle is already booked for these dates',
      });
      return;
    }

    // Create or find guest user
    let guestUser = await User.findOne({ email: bookingData.customerEmail });
    
    if (!guestUser) {
      // Create a guest user account
      guestUser = new User({
        email: bookingData.customerEmail,
        username: bookingData.customerEmail.split('@')[0] + '_' + Date.now(),
        password: Math.random().toString(36).slice(-8), // Random password
        firstName: bookingData.customerName.split(' ')[0] || 'Guest',
        lastName: bookingData.customerName.split(' ').slice(1).join(' ') || 'User',
        phone: bookingData.customerPhone,
        role: 'customer',
        isActive: true,
        language: 'en',
        currency: bookingData.currency || 'USD'
      });
      
      await guestUser.save();
    }

    // Set user ID from guest user
    bookingData.userId = guestUser._id;

    // Calculate pricing if not provided
    if (!bookingData.dailyRate) {
      bookingData.dailyRate = bookingData.currency === 'USD' ? vehicle.rentalPrice : vehicle.rentalPriceColones;
    }

    // Create booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Update vehicle's booked dates
    vehicle.bookedDates.push({
      start: pickupDate,
      end: returnDate,
      bookingId: booking._id,
    });
    await vehicle.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicleId', 'make vehicleModel year category primaryImage')
      .populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking?.toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message,
    });
  }
};

export const createBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const bookingData = req.body;
    
    // Validate vehicle exists
    const vehicle = await Vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      res.status(404).json({
        error: 'Vehicle not found',
        message: 'Vehicle with this ID does not exist',
      });
      return;
    }

    // Check if vehicle is available for the requested dates
    const pickupDate = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    
    if (!(vehicle as any).isAvailableForDateRange(pickupDate, returnDate)) {
      res.status(400).json({
        error: 'Vehicle not available',
        message: 'Vehicle is not available for the selected dates',
      });
      return;
    }

    // Check for booking conflicts
    const hasConflict = await (Booking as any).hasConflict(
      bookingData.vehicleId,
      pickupDate,
      returnDate
    );

    if (hasConflict) {
      res.status(400).json({
        error: 'Booking conflict',
        message: 'Vehicle is already booked for these dates',
      });
      return;
    }

    // Set user ID from authenticated user
    bookingData.userId = req.user.id;

    // Calculate pricing if not provided
    if (!bookingData.dailyRate) {
      bookingData.dailyRate = bookingData.currency === 'USD' ? vehicle.rentalPrice : vehicle.rentalPriceColones;
    }

    // Handle reseller commission and upcharge
    if (req.user.role === 'reseller') {
      const reseller = await User.findById(req.user.id);
      if (reseller && reseller.commissionRate) {
        bookingData.resellerId = req.user.id;
        bookingData.commissionRate = reseller.commissionRate;
        bookingData.commission = (bookingData.subtotal * reseller.commissionRate) / 100;
        
        // Handle upcharge if provided
        if (bookingData.upchargePercentage && bookingData.upchargePercentage > 0) {
          bookingData.upcharge = (bookingData.subtotal * bookingData.upchargePercentage) / 100;
          // Update total cost to include upcharge
          bookingData.totalCost = bookingData.subtotal + bookingData.upcharge;
        }
      }
    }

    // Create booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Update vehicle's booked dates
    vehicle.bookedDates.push({
      start: pickupDate,
      end: returnDate,
      bookingId: booking._id,
    });
    await vehicle.save();

    // Update reseller's total commissions
    if (booking.resellerId && booking.commission) {
      await User.findByIdAndUpdate(
        booking.resellerId,
        { $inc: { totalCommissions: booking.commission } }
      );
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicleId', 'make vehicleModel year category primaryImage')
      .populate('userId', 'firstName lastName email')
      .populate('resellerId', 'firstName lastName email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking?.toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message,
    });
  }
};

export const updateBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({
        error: 'Booking not found',
        message: 'Booking with this ID does not exist',
      });
      return;
    }

    // Users can only update their own bookings (except admin)
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own bookings',
      });
      return;
    }

    // If dates are being updated, check availability
    if (updates.pickupDate || updates.returnDate) {
      const newPickupDate = new Date(updates.pickupDate || booking.pickupDate);
      const newReturnDate = new Date(updates.returnDate || booking.returnDate);

      const hasConflict = await (Booking as any).hasConflict(
        booking.vehicleId,
        newPickupDate,
        newReturnDate,
        booking._id
      );

      if (hasConflict) {
        res.status(400).json({
          error: 'Booking conflict',
          message: 'Vehicle is not available for the new dates',
        });
        return;
      }

      // Update vehicle's booked dates
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (vehicle) {
        // Remove old booking dates
        vehicle.bookedDates = vehicle.bookedDates.filter(
          (date: any) => !date.bookingId.equals(booking._id)
        );
        
        // Add new booking dates
        vehicle.bookedDates.push({
          start: newPickupDate,
          end: newReturnDate,
          bookingId: booking._id,
        });
        
        await vehicle.save();
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('vehicleId', 'make model year category primaryImage')
     .populate('userId', 'firstName lastName email')
     .populate('resellerId', 'firstName lastName email');

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking?.toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to update booking',
      message: error.message,
    });
  }
};

export const cancelBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({
        error: 'Booking not found',
        message: 'Booking with this ID does not exist',
      });
      return;
    }

    // Users can only cancel their own bookings (except admin)
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only cancel your own bookings',
      });
      return;
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Remove booked dates from vehicle
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (vehicle) {
      vehicle.bookedDates = vehicle.bookedDates.filter(
        (date: any) => !date.bookingId.equals(booking._id)
      );
      await vehicle.save();
    }

    // Subtract commission from reseller if applicable
    if (booking.resellerId && booking.commission) {
      await User.findByIdAndUpdate(
        booking.resellerId,
        { $inc: { totalCommissions: -booking.commission } }
      );
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: (booking as any).toJSON(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to cancel booking',
      message: error.message,
    });
  }
};

export const getBookingStats = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can view stats
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: 'Access denied',
        message: 'Only admins can view booking statistics',
      });
      return;
    }

    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalCost' },
        },
      },
    ]);

    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCost' },
        },
      },
    ]);

    res.json({
      stats,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch booking statistics',
      message: error.message,
    });
  }
};