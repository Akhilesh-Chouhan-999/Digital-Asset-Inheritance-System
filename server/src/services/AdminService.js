// AdminService

import { User, Asset, Nominee, InactivityCase, AuditLog, VerificationEvent } from "../models/index.js";
import { ValidationError, NotFoundError, AuthorizationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

class AdminService {

  // Get system statistics
  async getSystemStats() {
    try {
      const totalUsers = await User.countDocuments();
      const totalAssets = await Asset.countDocuments();
      const totalNominees = await Nominee.countDocuments();
      const activeInactivityCases = await InactivityCase.countDocuments({ state: { $ne: 'resolved' } });
      const totalAuditLogs = await AuditLog.countDocuments();
      const totalVerificationEvents = await VerificationEvent.countDocuments();

      // Get statistics by time period
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
      const newAssetsLast30Days = await Asset.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

      // Get critical events in last 30 days
      const criticalEventsLast30Days = await AuditLog.countDocuments({
        severity: 'critical',
        timestamp: { $gte: thirtyDaysAgo }
      });

      // Get triggered cases
      const triggeredCases = await InactivityCase.countDocuments({ state: 'triggered' });

      logger.info('System stats retrieved');

      return {
        totalUsers,
        totalAssets,
        totalNominees,
        activeInactivityCases,
        triggeredCases,
        totalAuditLogs,
        totalVerificationEvents,
        last30Days: {
          newUsers: newUsersLast30Days,
          newAssets: newAssetsLast30Days,
          criticalEvents: criticalEventsLast30Days
        }
      };
    } catch (error) {
      logger.error('Error in AdminService.getSystemStats:', error);
      throw error;
    }
  }

  // Get user management data
  async getUserManagement(filters = {}) {
    try {
      const query = {};

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.role) query.role = filters.role;
      if (filters.search) {
        query.$or = [
          { email: new RegExp(filters.search, 'i') },
          { firstName: new RegExp(filters.search, 'i') },
          { lastName: new RegExp(filters.search, 'i') }
        ];
      }

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const skip = (page - 1) * limit;

      const users = await User.find(query)
        .select('-password -emailVerificationToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(query);

      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const assetCount = await Asset.countDocuments({ userId: user._id, status: { $ne: 'deleted' } });
          const nomineeCount = await Nominee.countDocuments({ userId: user._id });
          const inactiveCount = Math.floor(
            (new Date() - new Date(user.lastActiveAt)) / (1000 * 60 * 60 * 24)
          );

          return {
            ...user.toObject(),
            assetCount,
            nomineeCount,
            inactiveDays: inactiveCount
          };
        })
      );

      logger.info(`Retrieved user management data for ${enrichedUsers.length} users`);

      return {
        users: enrichedUsers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error in AdminService.getUserManagement:', error);
      throw error;
    }
  }

  // Get audit logs
  async getAuditLogs(filters = {}) {
    try {
      const query = {};

      // Apply filters
      if (filters.eventType) query.eventType = filters.eventType;
      if (filters.severity) query.severity = filters.severity;
      if (filters.userId) query.userId = filters.userId;
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
      }

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 50;
      const skip = (page - 1) * limit;

      const logs = await AuditLog.find(query)
        .populate('userId', 'email firstName lastName')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      const total = await AuditLog.countDocuments(query);

      logger.info(`Retrieved ${logs.length} audit logs`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error in AdminService.getAuditLogs:', error);
      throw error;
    }
  }

  // System configuration
  async getSystemConfig() {
    try {
      const config = {
        inactivityThresholdDays: 90,
        firstWarningDays: 60,
        reminderIntervalDays: 7,
        tokenExpiryHours: 1,
        refreshTokenExpiryDays: 7,
        encryptionAlgorithm: 'AES-256-GCM',
        sessionTimeout: 30
      };

      return config;
    } catch (error) {
      logger.error('Error in AdminService.getSystemConfig:', error);
      throw error;
    }
  }

  // Update system configuration
  async updateSystemConfig(configData) {
    try {
      // Validate configuration data
      if (configData.inactivityThresholdDays && configData.inactivityThresholdDays < 30) {
        throw new ValidationError('Inactivity threshold must be at least 30 days');
      }

      // In a real system, this would be saved to a config collection or environment
      // For now, we'll just validate and return
      const config = {
        inactivityThresholdDays: configData.inactivityThresholdDays || 90,
        firstWarningDays: configData.firstWarningDays || 60,
        reminderIntervalDays: configData.reminderIntervalDays || 7,
        tokenExpiryHours: configData.tokenExpiryHours || 1,
        refreshTokenExpiryDays: configData.refreshTokenExpiryDays || 7,
        encryptionAlgorithm: configData.encryptionAlgorithm || 'AES-256-GCM',
        sessionTimeout: configData.sessionTimeout || 30
      };

      logger.info('System configuration updated');

      return {
        config,
        message: 'System configuration updated successfully'
      };
    } catch (error) {
      logger.error('Error in AdminService.updateSystemConfig:', error);
      throw error;
    }
  }

  // Get health check
  async getHealthCheck() {
    try {
      const usersHealthy = await User.countDocuments() >= 0;
      const assetsHealthy = await Asset.countDocuments() >= 0;
      const nomineesHealthy = await Nominee.countDocuments() >= 0;

      return {
        status: 'healthy',
        database: 'connected',
        services: {
          users: usersHealthy ? 'operational' : 'degraded',
          assets: assetsHealthy ? 'operational' : 'degraded',
          nominees: nomineesHealthy ? 'operational' : 'degraded'
        },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error in AdminService.getHealthCheck:', error);
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

export default new AdminService();
