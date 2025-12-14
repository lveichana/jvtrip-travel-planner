// src/routes/auth.js
import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route (requires token)
router.get('/me', authMiddleware, getMe);

export default router;