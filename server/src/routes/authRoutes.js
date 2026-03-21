// Auth Routes
// Endpoints:
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/logout
// POST /api/auth/refresh-token
// GET /api/auth/verify-email/:token
// POST /api/auth/forgot-password
// POST /api/auth/reset-password/:token

import express from 'express';
import authController from '../controllers/AuthController.js';
import { verifyToken, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', requireAuth, authController.logout);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

export default router;