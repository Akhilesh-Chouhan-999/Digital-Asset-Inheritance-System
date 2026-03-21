// AdminController

import AdminService from "../services/AdminService.js";
import { ValidationError, AuthorizationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { OkResponse } from "../utils/successResponse.js";

class AdminController {

  async getSystemStats(req, res, next) {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AuthorizationError('Only admins can view system statistics');
      }

      const result = await AdminService.getSystemStats();

      const response = new OkResponse(result, "System statistics retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AdminController.getSystemStats: ", error);
      next(error);
    }
  }

  async getUserManagement(req, res, next) {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AuthorizationError('Only admins can access user management');
      }

      const filters = {
        status: req.query.status,
        role: req.query.role,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await AdminService.getUserManagement(filters);

      const response = new OkResponse(result, "User management data retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AdminController.getUserManagement: ", error);
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AuthorizationError('Only admins can access audit logs');
      }

      const filters = {
        eventType: req.query.eventType,
        severity: req.query.severity,
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await AdminService.getAuditLogs(filters);

      const response = new OkResponse(result, "Audit logs retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AdminController.getAuditLogs: ", error);
      next(error);
    }
  }

  async systemConfiguration(req, res, next) {
    try {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AuthorizationError('Only admins can configure system settings');
      }

      if (req.method === 'GET') {
        const result = await AdminService.getSystemConfig();
        const response = new OkResponse(result, "System configuration retrieved successfully");
        res.status(200).json(response.toJSON());
      } else if (req.method === 'POST') {
        const result = await AdminService.updateSystemConfig(req.body);
        const response = new OkResponse(result, "System configuration updated successfully");
        res.status(200).json(response.toJSON());
      } else {
        throw new ValidationError('Invalid request method');
      }

    } catch (error) {
      logger.error("Error in AdminController.systemConfiguration: ", error);
      next(error);
    }
  }

  async getHealthCheck(req, res, next) {
    try {
      const result = await AdminService.getHealthCheck();

      const response = new OkResponse(result, "Health check completed");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AdminController.getHealthCheck: ", error);
      next(error);
    }
  }
}

export default new AdminController();
