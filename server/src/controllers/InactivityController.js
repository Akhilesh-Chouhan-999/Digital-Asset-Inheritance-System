// InactivityController

import InactivityService from "../services/InactivityService.js";
import { ValidationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { OkResponse } from "../utils/successResponse.js";

class InactivityController {

  async getInactivityStatus(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new ValidationError("User ID is required");
      }

      const result = await InactivityService.getInactivityStatus(userId);

      const response = new OkResponse(result, "Inactivity status retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in InactivityController.getInactivityStatus: ", error);
      next(error);
    }
  }

  async markUserActive(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new ValidationError("User ID is required");
      }

      const result = await InactivityService.markUserActive(userId);

      const response = new OkResponse(result, "User marked as active successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in InactivityController.markUserActive: ", error);
      next(error);
    }
  }

  async getInactivityHistory(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new ValidationError("User ID is required");
      }

      const result = await InactivityService.getInactivityHistory(userId);

      const response = new OkResponse(result, "Inactivity history retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in InactivityController.getInactivityHistory: ", error);
      next(error);
    }
  }

  async triggerInheritanceManually(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new ValidationError("User ID is required");
      }

      // Only allow if user has admin role or is the user themselves
      if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
        throw new ValidationError("Not authorized to trigger inheritance");
      }

      const result = await InactivityService.triggerInheritance(userId);

      const response = new OkResponse(result, "Inheritance triggered successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in InactivityController.triggerInheritanceManually: ", error);
      next(error);
    }
  }
}

export default new InactivityController();
