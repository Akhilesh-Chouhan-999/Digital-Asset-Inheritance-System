// AssetService

import { Asset } from "../models/index.js";
import { ValidationError, NotFoundError, AuthorizationError } from "../utils/errorHandler.js";
import { encryptData, decryptData } from "../utils/cryptoUtils.js";
import logger from "../utils/logger.js";
import crypto from 'crypto';

class AssetService {


  async createAsset(userId, assetData) {
    try {
      const { type, title, description, metadata, visibility, accessibleTo, expiryDate, assetContent } = assetData;

      // Validate required fields
      if (!type || !title || !assetContent) {
        throw new ValidationError('Type, title, and asset content are required');
      }

      if (!['social', 'subscription', 'confidential_note', 'crypto', 'other'].includes(type)) {
        throw new ValidationError('Invalid asset type');
      }

      // Generate encryption key for this asset
      const encryptionKey = crypto.randomBytes(32).toString('hex');

      // Encrypt the asset content
      const encrypted = encryptData(assetContent, encryptionKey);

      // Create asset document
      const asset = await Asset.create({
        userId,
        type,
        title,
        description: description || null,
        encryptedData: encrypted.encrypted,
        encryptionAlgorithm: 'AES-256-GCM',
        metadata: {
          platform: metadata?.platform || null,
          accountUsername: metadata?.accountUsername || null,
          category: metadata?.category || null,
          tags: metadata?.tags || [],
          customFields: metadata?.customFields || {}
        },
        visibility: visibility || 'on_death',
        accessibleTo: accessibleTo || [],
        expiryDate: expiryDate || null,
        status: 'active',
        isShared: false
      });

      // Don't return encrypted data or encryption key to user
      logger.info(`Asset created: ${asset._id} for user: ${userId}`);

      return {
        assetId: asset._id,
        type: asset.type,
        title: asset.title,
        description: asset.description,
        visibility: asset.visibility,
        status: asset.status,
        createdAt: asset.createdAt,
        message: 'Asset created successfully'
      };
    } catch (error) {
      logger.error('Error in AssetService.createAsset:', error);
      throw error;
    }
  }

  async getAssets(userId, filters = {}) {
    try {

      
      const query = { userId, status: { $ne: 'deleted' } };

      // Apply additional filters
      if (filters.type) query.type = filters.type;
      if (filters.visibility) query.visibility = filters.visibility;

      const assets = await Asset.find(query)
        .select('-encryptedData')
        .sort({ createdAt: -1 })
        .exec();

      logger.info(`Retrieved ${assets.length} assets for user: ${userId}`);

      return {
        count: assets.length,
        assets: assets
      };
    } catch (error) {
      logger.error('Error in AssetService.getAssets:', error);
      throw error;
    }
  }

  async getAssetById(assetId, userId) {
    try {
      const asset = await Asset.findById(assetId);

      if (!asset) {
        throw new NotFoundError('Asset not found');
      }

      // Check ownership and authorization
      if (asset.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to access this asset');
      }

      logger.info(`Retrieved asset: ${assetId} for user: ${userId}`);

      return {
        assetId: asset._id,
        type: asset.type,
        title: asset.title,
        description: asset.description,
        metadata: asset.metadata,
        visibility: asset.visibility,
        accessibleTo: asset.accessibleTo,
        expiryDate: asset.expiryDate,
        status: asset.status,
        isShared: asset.isShared,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt
      };
    } catch (error) {
      logger.error('Error in AssetService.getAssetById:', error);
      throw error;
    }
  }

  async updateAsset(assetId, userId, assetData) {
    try {
      const asset = await Asset.findById(assetId);

      if (!asset) {
        throw new NotFoundError('Asset not found');
      }

      // Check ownership
      if (asset.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to update this asset');
      }

      // Update allowed fields
      if (assetData.title) asset.title = assetData.title;
      if (assetData.description) asset.description = assetData.description;
      if (assetData.metadata) asset.metadata = { ...asset.metadata, ...assetData.metadata };
      if (assetData.visibility) asset.visibility = assetData.visibility;
      if (assetData.accessibleTo) asset.accessibleTo = assetData.accessibleTo;
      if (assetData.expiryDate) asset.expiryDate = assetData.expiryDate;

      // If asset content is being updated, re-encrypt
      if (assetData.assetContent) {
        const encryptionKey = crypto.randomBytes(32).toString('hex');
        const encrypted = encryptData(assetData.assetContent, encryptionKey);
        asset.encryptedData = encrypted.encrypted;
      }

      asset.updatedAt = new Date();
      await asset.save();

      logger.info(`Asset updated: ${assetId} for user: ${userId}`);

      return {
        assetId: asset._id,
        type: asset.type,
        title: asset.title,
        description: asset.description,
        visibility: asset.visibility,
        status: asset.status,
        updatedAt: asset.updatedAt,
        message: 'Asset updated successfully'
      };
    } catch (error) {
      logger.error('Error in AssetService.updateAsset:', error);
      throw error;
    }
  }

  async deleteAsset(assetId, userId) {
    try {
      const asset = await Asset.findById(assetId);

      if (!asset) {
        throw new NotFoundError('Asset not found');
      }

      // Check ownership
      if (asset.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to delete this asset');
      }

      // Soft delete
      asset.status = 'deleted';
      asset.updatedAt = new Date();
      await asset.save();

      logger.info(`Asset deleted: ${assetId} for user: ${userId}`);

      return {
        assetId: asset._id,
        message: 'Asset deleted successfully'
      };
    } catch (error) {
      logger.error('Error in AssetService.deleteAsset:', error);
      throw error;
    }
  }

  async shareAsset(assetId, userId, shareWithNomineeId) {
    try {
      const asset = await Asset.findById(assetId);

      if (!asset) {
        throw new NotFoundError('Asset not found');
      }

      // Check ownership
      if (asset.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to share this asset');
      }

      // Add nominee to accessibleTo list if not already there
      if (!asset.accessibleTo.includes(shareWithNomineeId)) {
        asset.accessibleTo.push(shareWithNomineeId);
      }

      asset.isShared = true;
      await asset.save();

      logger.info(`Asset shared: ${assetId} with nominee: ${shareWithNomineeId}`);

      return {
        assetId: asset._id,
        isShared: asset.isShared,
        message: 'Asset shared successfully'
      };
    } catch (error) {
      logger.error('Error in AssetService.shareAsset:', error);
      throw error;
    }
  }

  async archiveAsset(assetId, userId) {
    try {
      const asset = await Asset.findById(assetId);

      if (!asset) {
        throw new NotFoundError('Asset not found');
      }

      // Check ownership
      if (asset.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to archive this asset');
      }

      asset.status = 'archived';
      asset.updatedAt = new Date();
      await asset.save();

      logger.info(`Asset archived: ${assetId} for user: ${userId}`);

      return {
        assetId: asset._id,
        status: asset.status,
        message: 'Asset archived successfully'
      };
    } catch (error) {
      logger.error('Error in AssetService.archiveAsset:', error);
      throw error;
    }
  }
}

export default new AssetService();
