// AssetController

import AssetService from "../services/AssetService.js";
import { ValidationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { CreatedResponse, OkResponse } from "../utils/successResponse.js";

class AssetController {

  async createAsset(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { type, title, description, metadata, visibility, accessibleTo, expiryDate, assetContent } = req.body;

      // Validate required fields
      if (!type || !title || !assetContent) {
        throw new ValidationError('Type, title, and asset content are required');
      }

      const result = await AssetService.createAsset(userId, {
        type,
        title,
        description,
        metadata,
        visibility,
        accessibleTo,
        expiryDate,
        assetContent
      });

      const response = new CreatedResponse(result, "Asset created successfully");
      res.status(201).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.createAsset: ", error);
      next(error);
    }
  }

  async getAssets(req, res, next) {

    try {
      const userId = req.user?.userId;
      const { type, visibility } = req.query;

      const result = await AssetService.getAssets(userId, { type, visibility });

      const response = new OkResponse(result, "Assets retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.getAssets: ", error);
      next(error);
    }
  }

  async getAssetById(req, res, next) {
    
    try {
      const userId = req.user?.userId;
      const { assetId } = req.params;

      if (!assetId) {
        throw new ValidationError("Asset ID is required");
      }

      const result = await AssetService.getAssetById(assetId, userId);

      const response = new OkResponse(result, "Asset retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.getAssetById: ", error);
      next(error);
    }
  }

  async updateAsset(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { assetId } = req.params;
      const { title, description, metadata, visibility, accessibleTo, expiryDate, assetContent } = req.body;

      if (!assetId) {
        throw new ValidationError("Asset ID is required");
      }

      const result = await AssetService.updateAsset(assetId, userId, {
        title,
        description,
        metadata,
        visibility,
        accessibleTo,
        expiryDate,
        assetContent
      });

      const response = new OkResponse(result, "Asset updated successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.updateAsset: ", error);
      next(error);
    }
  }

  async deleteAsset(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { assetId } = req.params;

      if (!assetId) {
        throw new ValidationError("Asset ID is required");
      }

      const result = await AssetService.deleteAsset(assetId, userId);

      const response = new OkResponse(result, "Asset deleted successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.deleteAsset: ", error);
      next(error);
    }
  }

  async shareAsset(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { assetId } = req.params;
      const { nomineeId } = req.body;

      if (!assetId || !nomineeId) {
        throw new ValidationError("Asset ID and Nominee ID are required");
      }

      const result = await AssetService.shareAsset(assetId, userId, nomineeId);

      const response = new OkResponse(result, "Asset shared successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.shareAsset: ", error);
      next(error);
    }
  }

  async archiveAsset(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { assetId } = req.params;

      if (!assetId) {
        throw new ValidationError("Asset ID is required");
      }

      const result = await AssetService.archiveAsset(assetId, userId);

      const response = new OkResponse(result, "Asset archived successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AssetController.archiveAsset: ", error);
      next(error);
    }
  }
}

export default new AssetController();
