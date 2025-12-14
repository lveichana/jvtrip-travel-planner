// src/routes/activities.js
import express from 'express';
import { 
  getActivities, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '../controllers/activityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(authMiddleware);

// Activity routes
router.get('/trips/:tripId/activities', getActivities);
router.post('/trips/:tripId/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

export default router;