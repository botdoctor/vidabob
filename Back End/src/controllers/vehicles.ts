import { Request, Response } from 'express';
import Vehicle from '../models/VehicleNew';
import Sale from '../models/Sale';
import { authorize } from '../middleware/auth';
import { getCachedVehicles, cacheVehicles, getCachedVehicle, cacheVehicle, invalidateVehicleCache } from '../utils/cache';
import { asyncHandler } from '../middleware/error';

export const getAllVehicles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category, minPrice, maxPrice, available, startDate, endDate } = req.query;

  // Check if we can use cached data (only for simple queries without filters)
  const hasFilters = category || minPrice || maxPrice || available !== undefined || startDate || endDate;
  
  // Temporarily disable cache to debug
  // if (!hasFilters) {
  //   const cachedVehicles = await getCachedVehicles();
  //   if (cachedVehicles) {
  //     res.json({ vehicles: cachedVehicles });
  //     return;
  //   }
  // }

  let query: any = {};
  
  if (category) query.category = category;
  if (available !== undefined) query.available = available === 'true';
  if (minPrice || maxPrice) {
    query.$or = [
      {
        type: { $in: ['rental', 'both'] },
        rentalPrice: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) })
        }
      },
      {
        type: { $in: ['sale', 'both'] },
        salePrice: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) })
        }
      }
    ];
  }

  let vehicles;
  
  if (startDate && endDate) {
    // Find vehicles available for specific date range
    vehicles = await (Vehicle as any).findAvailableForRental(
      new Date(startDate as string),
      new Date(endDate as string),
      query
    );
  } else {
    vehicles = await Vehicle.find(query);
  }

  const vehicleData = vehicles.map((vehicle: any) => {
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

  // Cache the result if it's a simple query
  if (!hasFilters) {
    await cacheVehicles();
  }

  res.json({ vehicles: vehicleData });
});

export const getVehicleById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // Try cache first
  const cachedVehicle = await getCachedVehicle(id);
  if (cachedVehicle) {
    res.json({ vehicle: cachedVehicle });
    return;
  }
  
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    res.status(404).json({
      error: 'Vehicle not found',
        message: 'Vehicle with this ID does not exist',
      });
      return;
    }

  const obj = vehicle.toObject();
  const vehicleData = {
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
  
  // Cache the vehicle
  await cacheVehicle(id, vehicleData);
  
  res.json({
    vehicle: vehicleData,
  });
});

export const createVehicle = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const vehicleData = req.body;
  const io = req.app.get('io');

  // Parse JSON fields that were stringified
  if (vehicleData.engine && typeof vehicleData.engine === 'string') {
    vehicleData.engine = JSON.parse(vehicleData.engine);
  }
  if (vehicleData.color && typeof vehicleData.color === 'string') {
    vehicleData.color = JSON.parse(vehicleData.color);
  }
  if (vehicleData.features && typeof vehicleData.features === 'string') {
    vehicleData.features = JSON.parse(vehicleData.features);
  }

  // Handle uploaded files
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Handle primary image
    if (files.primaryImage && files.primaryImage[0]) {
      vehicleData.primaryImage = `/uploads/${files.primaryImage[0].filename}`;
    }
    
    // Handle additional images
    if (files.additionalImages) {
      const additionalImageUrls = files.additionalImages.map(file => `/uploads/${file.filename}`);
      vehicleData.images = vehicleData.primaryImage 
        ? [vehicleData.primaryImage, ...additionalImageUrls]
        : additionalImageUrls;
    } else if (vehicleData.primaryImage) {
      vehicleData.images = [vehicleData.primaryImage];
    }
  }

  const vehicle = new Vehicle(vehicleData);
  await vehicle.save();

  const obj = vehicle.toObject();
  const createdVehicle = {
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

  // Invalidate cache
  await invalidateVehicleCache();

  // Emit real-time update
  if (io) {
    io.emit('vehicle:created', createdVehicle);
  }

  res.status(201).json({
    message: 'Vehicle created successfully',
    vehicle: createdVehicle,
  });
});

export const updateVehicle = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  const io = req.app.get('io');

  // Parse JSON fields that were stringified
  if (updates.engine && typeof updates.engine === 'string') {
    updates.engine = JSON.parse(updates.engine);
  }
  if (updates.color && typeof updates.color === 'string') {
    updates.color = JSON.parse(updates.color);
  }
  if (updates.features && typeof updates.features === 'string') {
    updates.features = JSON.parse(updates.features);
  }

  // Handle uploaded files
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Handle primary image
    if (files.primaryImage && files.primaryImage[0]) {
      updates.primaryImage = `/uploads/${files.primaryImage[0].filename}`;
    }
    
    // Handle additional images
    if (files.additionalImages) {
      const additionalImageUrls = files.additionalImages.map(file => `/uploads/${file.filename}`);
      
      // If keepExisting is true, append to existing images, otherwise replace
      if (updates.keepExistingImages === 'true') {
        const existingVehicle = await Vehicle.findById(id);
        if (existingVehicle) {
          const existingImages = existingVehicle.images || [];
          updates.images = [...new Set([...existingImages, ...additionalImageUrls])];
        }
      } else {
        updates.images = updates.primaryImage 
          ? [updates.primaryImage, ...additionalImageUrls]
          : additionalImageUrls;
      }
    } else if (updates.primaryImage && updates.keepExistingImages !== 'true') {
      updates.images = [updates.primaryImage];
    }
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    res.status(404).json({
      error: 'Vehicle not found',
      message: 'Vehicle with this ID does not exist',
    });
    return;
  }

  const obj = vehicle.toObject();
  const updatedVehicle = {
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

  // Invalidate cache
  await invalidateVehicleCache(id);

  // Emit real-time update
  if (io) {
    io.emit('vehicle:updated', updatedVehicle);
  }

  res.json({
    message: 'Vehicle updated successfully',
    vehicle: updatedVehicle,
  });
});

export const deleteVehicle = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  const io = req.app.get('io');

  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) {
    res.status(404).json({
      error: 'Vehicle not found',
      message: 'Vehicle with this ID does not exist',
    });
    return;
  }

  // Invalidate cache
  await invalidateVehicleCache(id);

  // Emit real-time update
  if (io) {
    io.emit('vehicle:deleted', { id });
  }

  res.json({
    message: 'Vehicle deleted successfully',
  });
});

export const checkAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({
      error: 'Missing parameters',
      message: 'Start date and end date are required',
    });
    return;
  }

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    res.status(404).json({
      error: 'Vehicle not found',
      message: 'Vehicle with this ID does not exist',
    });
    return;
  }

  const available = (vehicle as any).isAvailableForDateRange(
    new Date(startDate as string),
    new Date(endDate as string)
  );

  res.json({
    available,
    vehicleId: id,
    startDate,
    endDate,
  });
});

export const markVehicleAsSold = asyncHandler(async (req: any, res: Response): Promise<void> => {
  // Only admin can mark vehicles as sold
  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Access denied',
      message: 'Only admins can mark vehicles as sold',
    });
    return;
  }

  const { id } = req.params;
  const { salePrice, customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;

  // Validate sale price
  if (!salePrice || salePrice <= 0) {
    res.status(400).json({
      error: 'Invalid sale price',
      message: 'Sale price must be greater than 0',
    });
    return;
  }

  // Find the vehicle
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    res.status(404).json({
      error: 'Vehicle not found',
      message: 'Vehicle with this ID does not exist',
    });
    return;
  }

  // Check if vehicle is already sold
  if (vehicle.status === 'sold') {
    res.status(400).json({
      error: 'Vehicle already sold',
      message: 'This vehicle has already been marked as sold',
    });
    return;
  }

  // Create sale record
  const sale = new Sale({
    vehicleId: vehicle._id,
    salePrice,
    soldDate: new Date(),
    soldBy: req.user.id,
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod,
    notes,
  });

  await sale.save();

  // Update vehicle status
  vehicle.status = 'sold';
  vehicle.available = false;
  vehicle.updatedBy = req.user.id;
  await vehicle.save();

  // Invalidate cache
  await invalidateVehicleCache(id);

  // Transform vehicle data
  const soldVehicle = {
    id: vehicle._id.toString(),
    make: vehicle.make,
    model: vehicle.vehicleModel,
    year: vehicle.year,
    status: vehicle.status,
    available: vehicle.available,
    salePrice: salePrice,
    soldDate: sale.soldDate,
  };

  res.json({
    message: 'Vehicle marked as sold successfully',
    vehicle: soldVehicle,
    sale: sale.toJSON(),
  });
});