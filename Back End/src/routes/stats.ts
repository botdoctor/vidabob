import express from 'express';
import { getAdminDashboardStats, getAdminAnalyticsData } from '../controllers/stats';
import authenticate, { authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/admin/dashboard', authorize(['admin']), getAdminDashboardStats);
router.get('/admin/analytics', authorize(['admin']), getAdminAnalyticsData);

export default router;