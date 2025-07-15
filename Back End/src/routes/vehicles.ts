import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkAvailability,
  markVehicleAsSold,
} from '../controllers/vehicles';
import authenticate, { authorize } from '../middleware/auth';
import { uploadVehicleImages } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getAllVehicles);

// Admin only routes
router.post('/', authenticate, authorize(['admin']), uploadVehicleImages, createVehicle);

// Parametric routes (must come last)
router.get('/:id', getVehicleById);
router.get('/:id/availability', checkAvailability);
router.post('/:id/sell', authenticate, authorize(['admin']), markVehicleAsSold);
router.put('/:id', authenticate, authorize(['admin']), uploadVehicleImages, updateVehicle);
router.delete('/:id', authenticate, authorize(['admin']), deleteVehicle);

export default router;