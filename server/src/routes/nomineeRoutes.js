// Nominee Routes
// Endpoints:
// POST /api/nominees
// GET /api/nominees
// PUT /api/nominees/:nomineeId
// DELETE /api/nominees/:nomineeId
// GET /api/nominees/:nomineeId/verify

import express from 'express';
import nomineeController from '../controllers/NomineeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/nominees - Add nominee
router.post('/', requireAuth, nomineeController.addNominee);

// GET /api/nominees - Get all nominees
router.get('/', requireAuth, nomineeController.getNominees);

// PUT /api/nominees/:nomineeId - Update nominee
router.put('/:nomineeId', requireAuth, nomineeController.updateNominee);

// DELETE /api/nominees/:nomineeId - Delete nominee
router.delete('/:nomineeId', requireAuth, nomineeController.deleteNominee);

// GET /api/nominees/:nomineeId/verify - Verify nominee
router.get('/:nomineeId/verify', nomineeController.verifyNominee);

export default router;
