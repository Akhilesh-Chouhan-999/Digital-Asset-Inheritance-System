// Asset Routes
// Endpoints:
// POST /api/assets
// GET /api/assets
// GET /api/assets/:assetId
// PUT /api/assets/:assetId
// DELETE /api/assets/:assetId

import express from 'express';
import assetController from '../controllers/AssetController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/assets - Create asset
router.post('/', requireAuth, assetController.createAsset);

// GET /api/assets - Get all assets
router.get('/', requireAuth, assetController.getAssets);

// GET /api/assets/:assetId - Get asset by ID
router.get('/:assetId', requireAuth, assetController.getAssetById);

// PUT /api/assets/:assetId - Update asset
router.put('/:assetId', requireAuth, assetController.updateAsset);

// DELETE /api/assets/:assetId - Delete asset
router.delete('/:assetId', requireAuth, assetController.deleteAsset);

export default router;
