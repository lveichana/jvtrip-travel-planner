// src/routes/trips.js
import express from 'express';
import { 
  getAllTrips, 
  getCurrentTrip,
  getTripById, 
  createTrip, 
  updateTrip, 
  changeStatus,
  deleteTrip 
} from '../controllers/tripController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(authMiddleware);

// Trip routes
router.get('/', getAllTrips);
router.get('/current', getCurrentTrip);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.patch('/:id/status', changeStatus);
router.delete('/:id', deleteTrip);

export default router;