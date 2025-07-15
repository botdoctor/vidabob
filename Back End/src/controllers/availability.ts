import { Request, Response } from 'express';
import Vehicle from '../models/VehicleNew';
import Booking from '../models/Booking';
import mongoose from 'mongoose';

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, startDate, endDate } = req.query;

    let checkStartDate: Date;
    let checkEndDate: Date;

    if (startDate && endDate) {
      // Date range request
      if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        res.status(400).json({
          error: 'Invalid date parameters',
          message: 'Please provide startDate and endDate in YYYY-MM-DD format',
        });
        return;
      }

      checkStartDate = new Date(startDate);
      checkEndDate = new Date(endDate);

      if (checkEndDate <= checkStartDate) {
        res.status(400).json({
          error: 'Invalid date range',
          message: 'End date must be after start date',
        });
        return;
      }
    } else if (date) {
      // Single date request (legacy support)
      if (typeof date !== 'string') {
        res.status(400).json({
          error: 'Date parameter is required',
          message: 'Please provide a date in YYYY-MM-DD format',
        });
        return;
      }

      const singleDate = new Date(date);
      checkStartDate = new Date(singleDate);
      checkStartDate.setHours(0, 0, 0, 0);
      checkEndDate = new Date(singleDate);
      checkEndDate.setHours(23, 59, 59, 999);
    } else {
      res.status(400).json({
        error: 'Date parameter required',
        message: 'Please provide either "date" or "startDate" and "endDate" parameters',
      });
      return;
    }

    // Get all available vehicles that can be rented
    const allRentalVehicles = await Vehicle.find({
      available: true,
      type: { $in: ['rental', 'both'] }
    });

    // Get all confirmed or pending bookings that overlap with the requested date range
    const overlappingBookings = await Booking.find({
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          pickupDate: { $lte: checkEndDate },
          returnDate: { $gte: checkStartDate }
        }
      ]
    }).select('vehicleId');

    // Extract vehicle IDs that are booked
    const bookedVehicleIds = overlappingBookings.map(booking => booking.vehicleId.toString());

    // Filter out booked vehicles
    const availableVehicles = allRentalVehicles.filter(vehicle => 
      !bookedVehicleIds.includes(vehicle._id.toString())
    );

    // Transform vehicles to match frontend format
    const vehicleData = availableVehicles.map((vehicle: any) => {
      const obj = vehicle.toObject();
      
      return {
        id: obj._id.toString(),
        make: obj.make,
        model: obj.vehicleModel,
        year: obj.year,
        vin: obj.vin,
        category: obj.category,
        subcategory: obj.subcategory,
        type: obj.type,
        salePrice: obj.salePrice,
        rentalPrice: obj.rentalPrice,
        salePriceColones: obj.salePriceColones,
        rentalPriceColones: obj.rentalPriceColones,
        minRentalPrice: obj.minRentalPrice,
        engine: obj.engine,
        transmission: obj.transmission,
        drivetrain: obj.drivetrain,
        towingCapacity: obj.towingCapacity,
        seats: obj.seats,
        doors: obj.doors,
        mileage: obj.mileage,
        color: obj.color,
        condition: obj.condition,
        images: obj.images,
        primaryImage: obj.primaryImage,
        features: obj.features,
        safetyFeatures: obj.safetyFeatures,
        techFeatures: obj.techFeatures,
        packages: obj.packages,
        status: obj.status,
        available: obj.available,
        isFeatures: obj.isFeatures,
        location: obj.location,
        description: obj.description,
        bookedDates: obj.bookedDates || [],
        minRentalDays: obj.minRentalDays,
        maxRentalDays: obj.maxRentalDays,
        notes: obj.notes,
        tags: obj.tags,
        slug: obj.slug,
        metaTitle: obj.metaTitle,
        metaDescription: obj.metaDescription,
        keywords: obj.keywords,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        createdBy: obj.createdBy,
        updatedBy: obj.updatedBy
      };
    });

    res.json({
      date: date || `${startDate} to ${endDate}`,
      startDate: startDate || date,
      endDate: endDate || date,
      totalVehicles: allRentalVehicles.length,
      availableCount: availableVehicles.length,
      bookedCount: bookedVehicleIds.length,
      vehicles: vehicleData
    });
  } catch (error: any) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      error: 'Failed to check availability',
      message: error.message,
    });
  }
};

export const checkVehicleAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.params;
    const { startDate, endDate } = req.query;

    if (!vehicleId || !startDate || !endDate) {
      res.status(400).json({
        error: 'Missing parameters',
        message: 'Vehicle ID, start date, and end date are required',
      });
      return;
    }

    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      res.status(404).json({
        error: 'Vehicle not found',
        message: 'The specified vehicle does not exist',
      });
      return;
    }

    // Parse dates
    const pickup = new Date(startDate as string);
    const returnDate = new Date(endDate as string);

    if (returnDate <= pickup) {
      res.status(400).json({
        error: 'Invalid date range',
        message: 'Return date must be after pickup date',
      });
      return;
    }

    // Check for conflicts using the model's static method
    const hasConflict = await (Booking as any).hasConflict(
      new mongoose.Types.ObjectId(vehicleId),
      pickup,
      returnDate
    );

    res.json({
      vehicleId,
      startDate,
      endDate,
      available: !hasConflict,
      message: hasConflict 
        ? 'Vehicle is not available for the selected dates'
        : 'Vehicle is available for the selected dates'
    });
  } catch (error: any) {
    console.error('Error checking vehicle availability:', error);
    res.status(500).json({
      error: 'Failed to check vehicle availability',
      message: error.message,
    });
  }
};