import { Request, Response } from 'express';
import Settings from '../models/Settings';
import { asyncHandler } from '../middleware/error';

export const getSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = new Settings({
      updatedBy: 'system'
    });
    await settings.save();
  }
  
  res.json({
    settings: settings.toJSON()
  });
});

export const updateSettings = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const updates = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  // Find existing settings or create new one
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (settings) {
    // Update existing settings
    Object.assign(settings, updates);
    settings.updatedBy = userId;
    settings.updatedAt = new Date();
    await settings.save();
  } else {
    // Create new settings
    settings = new Settings({
      ...updates,
      updatedBy: userId
    });
    await settings.save();
  }
  
  // Emit real-time update to connected clients
  if (io) {
    io.emit('settings:updated', settings.toJSON());
  }
  
  res.json({
    message: 'Settings updated successfully',
    settings: settings.toJSON()
  });
});

export const updateBusinessHours = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { businessHours } = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    settings = new Settings({ updatedBy: userId });
  }
  
  settings.businessHours = businessHours;
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:businessHours:updated', settings.businessHours);
  }
  
  res.json({
    message: 'Business hours updated successfully',
    businessHours: settings.businessHours
  });
});

export const addHoliday = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const holidayData = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    settings = new Settings({ updatedBy: userId });
  }
  
  settings.holidays.push(holidayData);
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:holiday:added', holidayData);
  }
  
  res.json({
    message: 'Holiday added successfully',
    holiday: holidayData,
    holidays: settings.holidays
  });
});

export const removeHoliday = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { holidayId } = req.params;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    res.status(404).json({
      error: 'Settings not found',
      message: 'No settings configuration found'
    });
    return;
  }
  
  const holidayIndex = settings.holidays.findIndex(h => (h as any)._id?.toString() === holidayId);
  
  if (holidayIndex === -1) {
    res.status(404).json({
      error: 'Holiday not found',
      message: 'Holiday with this ID does not exist'
    });
    return;
  }
  
  settings.holidays.splice(holidayIndex, 1);
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:holiday:removed', { holidayId });
  }
  
  res.json({
    message: 'Holiday removed successfully',
    holidays: settings.holidays
  });
});

export const addBlackoutDate = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const blackoutData = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    settings = new Settings({ updatedBy: userId });
  }
  
  settings.blackoutDates.push(blackoutData);
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:blackout:added', blackoutData);
  }
  
  res.json({
    message: 'Blackout date added successfully',
    blackoutDate: blackoutData,
    blackoutDates: settings.blackoutDates
  });
});

export const removeBlackoutDate = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { blackoutId } = req.params;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    res.status(404).json({
      error: 'Settings not found',
      message: 'No settings configuration found'
    });
    return;
  }
  
  const blackoutIndex = settings.blackoutDates.findIndex(b => (b as any)._id?.toString() === blackoutId);
  
  if (blackoutIndex === -1) {
    res.status(404).json({
      error: 'Blackout date not found',
      message: 'Blackout date with this ID does not exist'
    });
    return;
  }
  
  settings.blackoutDates.splice(blackoutIndex, 1);
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:blackout:removed', { blackoutId });
  }
  
  res.json({
    message: 'Blackout date removed successfully',
    blackoutDates: settings.blackoutDates
  });
});

export const updateRentalConfig = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { rentalConfig } = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    settings = new Settings({ updatedBy: userId });
  }
  
  settings.rentalConfig = { ...settings.rentalConfig, ...rentalConfig };
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:rentalConfig:updated', settings.rentalConfig);
  }
  
  res.json({
    message: 'Rental configuration updated successfully',
    rentalConfig: settings.rentalConfig
  });
});

export const updateCompanyInfo = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const { companyInfo } = req.body;
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  let settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    settings = new Settings({ updatedBy: userId });
  }
  
  settings.companyInfo = { ...settings.companyInfo, ...companyInfo };
  settings.updatedBy = userId;
  settings.updatedAt = new Date();
  await settings.save();
  
  if (io) {
    io.emit('settings:companyInfo:updated', settings.companyInfo);
  }
  
  res.json({
    message: 'Company information updated successfully',
    companyInfo: settings.companyInfo
  });
});

export const resetSettings = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const userId = req.user?.id || 'admin';
  const io = req.app.get('io');
  
  // Delete all existing settings
  await Settings.deleteMany({});
  
  // Create new default settings
  const settings = new Settings({
    updatedBy: userId
  });
  await settings.save();
  
  if (io) {
    io.emit('settings:reset', settings.toJSON());
  }
  
  res.json({
    message: 'Settings reset to defaults successfully',
    settings: settings.toJSON()
  });
});

export const getBusinessHours = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  if (!settings) {
    // Return default business hours
    const defaultBusinessHours = {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
    };
    
    res.json({
      businessHours: defaultBusinessHours
    });
    return;
  }
  
  res.json({
    businessHours: settings.businessHours
  });
});

export const getHolidays = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  res.json({
    holidays: settings?.holidays || []
  });
});

export const getBlackoutDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  res.json({
    blackoutDates: settings?.blackoutDates || []
  });
});

export const isDateAvailable = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { date } = req.params;
  const checkDate = new Date(date);
  const settings = await Settings.findOne().sort({ updatedAt: -1 });
  
  let available = true;
  let reason = '';
  
  if (settings) {
    // Check business hours
    const dayOfWeek = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayConfig = settings.businessHours[dayOfWeek];
    
    if (!dayConfig?.isOpen) {
      available = false;
      reason = 'Business is closed on this day';
    }
    
    // Check holidays
    const isHoliday = settings.holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === checkDate.toDateString();
    });
    
    if (isHoliday) {
      available = false;
      reason = 'Holiday';
    }
    
    // Check blackout dates
    const isBlackout = settings.blackoutDates.some(blackout => {
      const startDate = new Date(blackout.startDate);
      const endDate = new Date(blackout.endDate);
      return checkDate >= startDate && checkDate <= endDate;
    });
    
    if (isBlackout) {
      available = false;
      reason = 'Blackout period';
    }
  }
  
  res.json({
    date: checkDate.toISOString(),
    available,
    reason
  });
});