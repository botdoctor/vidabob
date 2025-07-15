import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as settingsController from '../controllers/settings';

const router = express.Router();

// All settings routes require authentication
router.use(authenticate);

// Get all settings (admin only)
router.get('/', authorize(['admin']), settingsController.getSettings);

// Update settings (admin only)
router.put('/', authorize(['admin']), settingsController.updateSettings);

// Business hours
router.get('/business-hours', settingsController.getBusinessHours);
router.put('/business-hours', authorize(['admin']), settingsController.updateBusinessHours);

// Holidays
router.get('/holidays', settingsController.getHolidays);
router.post('/holidays', authorize(['admin']), settingsController.addHoliday);
router.delete('/holidays/:holidayId', authorize(['admin']), settingsController.removeHoliday);

// Blackout dates
router.get('/blackout-dates', settingsController.getBlackoutDates);
router.post('/blackout-dates', authorize(['admin']), settingsController.addBlackoutDate);
router.delete('/blackout-dates/:blackoutId', authorize(['admin']), settingsController.removeBlackoutDate);

// Rental configuration
router.put('/rental-config', authorize(['admin']), settingsController.updateRentalConfig);

// Company information
router.put('/company-info', authorize(['admin']), settingsController.updateCompanyInfo);

// Date availability check (public for booking system)
router.get('/date-availability/:date', settingsController.isDateAvailable);

// Reset settings (admin only)
router.post('/reset', authorize(['admin']), settingsController.resetSettings);

export default router;