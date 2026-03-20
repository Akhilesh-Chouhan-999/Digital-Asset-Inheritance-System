// Inactivity Routes
// Endpoints:
// GET /api/inactivity/status
// POST /api/inactivity/mark-active
// GET /api/inactivity/history
// POST /api/inactivity/trigger

import express from 'express';
import inactivityController from '../controllers/InactivityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/inactivity/status - Get inactivity status
router.get('/status', requireAuth, inactivityController.getInactivityStatus);

// POST /api/inactivity/mark-active - Mark user as active
router.post('/mark-active', requireAuth, inactivityController.markUserActive);

// GET /api/inactivity/history - Get inactivity history
router.get('/history', requireAuth, inactivityController.getInactivityHistory);

// POST /api/inactivity/trigger - Trigger inheritance manually
router.post('/trigger', requireAuth, inactivityController.triggerInheritanceManually);

export default router;
