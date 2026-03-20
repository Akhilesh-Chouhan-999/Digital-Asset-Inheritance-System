// Admin Routes
// Endpoints:
// GET /api/admin/stats
// GET /api/admin/users
// GET /api/admin/audit-logs
// POST /api/admin/config

import express from 'express';
import adminController from '../controllers/AdminController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/admin/stats - Get system statistics
router.get('/stats', requireAuth, adminController.getSystemStats);

// GET /api/admin/users - Get user management
router.get('/users', requireAuth, adminController.getUserManagement);

// GET /api/admin/audit-logs - Get audit logs
router.get('/audit-logs', requireAuth, adminController.getAuditLogs);

// POST /api/admin/config - System configuration
router.post('/config', requireAuth, adminController.systemConfiguration);

export default router;
