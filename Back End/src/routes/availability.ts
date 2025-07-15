import express from 'express';
import { checkAvailability, checkVehicleAvailability } from '../controllers/availability';

const router = express.Router();

// GET /api/availability?date=YYYY-MM-DD
// Returns all available vehicles for a specific date
router.get('/', checkAvailability);

// GET /api/availability/:vehicleId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// Check if a specific vehicle is available for a date range
router.get('/:vehicleId', checkVehicleAvailability);

export default router;