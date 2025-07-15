import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  createPublicBooking,
  updateBooking,
  cancelBooking,
  getBookingStats,
} from '../controllers/bookings';
import authenticate, { authorize } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.post('/public', createPublicBooking);

// All other routes require authentication
router.use(authenticate);

// Routes for all authenticated users
router.get('/', getAllBookings);
router.post('/', createBooking);

// Admin only routes (specific routes first)
router.get('/admin/stats', authorize(['admin']), getBookingStats);

// Parametric routes (must come last)
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', cancelBooking);

export default router;