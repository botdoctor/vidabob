import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getResellers,
  updateResellerCommission,
  getUserBookings,
  getResellerBookings,
  createReseller,
  getResellerDashboardStats,
} from '../controllers/users';
import authenticate, { authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes (specific routes first)
router.get('/', authorize(['admin']), getAllUsers);
router.get('/role/resellers', authorize(['admin']), getResellers);
router.post('/role/resellers', authorize(['admin']), createReseller);

// Reseller specific routes
router.get('/reseller/dashboard-stats', authorize(['reseller']), getResellerDashboardStats);

// Routes for all authenticated users (parametric routes last)
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);
router.get('/:id/bookings', getUserBookings);
router.put('/:id/commission', authorize(['admin']), updateResellerCommission);
router.get('/:id/reseller-bookings', authorize(['admin', 'reseller']), getResellerBookings);

export default router;