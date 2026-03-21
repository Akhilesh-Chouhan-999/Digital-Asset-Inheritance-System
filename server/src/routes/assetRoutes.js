// Asset Routes
// Endpoints:
// POST /api/v1/assets - Create asset
// GET /api/v1/assets - Get all assets
// GET /api/v1/assets/:assetId - Get asset by ID
// PUT /api/v1/assets/:assetId - Update asset
// DELETE /api/v1/assets/:assetId - Delete asset
// POST /api/v1/assets/:assetId/share - Share asset
// POST /api/v1/assets/:assetId/archive - Archive asset

import express from 'express';
import assetController from '../controllers/AssetController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/assets - Create asset
router.post('/', requireAuth, assetController.createAsset);

// GET /api/v1/assets - Get all assets
router.get('/', requireAuth, assetController.getAssets);

// GET /api/v1/assets/:assetId - Get asset by ID
router.get('/:assetId', requireAuth, assetController.getAssetById);

// PUT /api/v1/assets/:assetId - Update asset
router.put('/:assetId', requireAuth, assetController.updateAsset);

// DELETE /api/v1/assets/:assetId - Delete asset
router.delete('/:assetId', requireAuth, assetController.deleteAsset);

// POST /api/v1/assets/:assetId/share - Share asset with nominee
router.post('/:assetId/share', requireAuth, assetController.shareAsset);

// POST /api/v1/assets/:assetId/archive - Archive asset
router.post('/:assetId/archive', requireAuth, assetController.archiveAsset);

export default router;
