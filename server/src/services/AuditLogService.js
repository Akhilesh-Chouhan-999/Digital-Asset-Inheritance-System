// AuditLogService - Handles audit logging for system events

import { AuditLog } from "../models/index.js";
import logger from "../utils/logger.js";

class AuditLogService {

  /**
   * Log an event to audit log
   */
  async logEvent(userId, eventType, description, severity = 'info', metadata = {}, ipAddress = null, userAgent = null) {
    try {
      const auditLog = await AuditLog.create({
        userId,
        eventType,
        description,
        severity,
        metadata,
        ipAddress: ipAddress || '127.0.0.1',
        userAgent: userAgent || 'Unknown'
      });

      logger.info(`Audit log created for user: ${userId}, event: ${eventType}`);

      return {
        logId: auditLog._id,
        eventType: auditLog.eventType,
        timestamp: auditLog.timestamp
      };
    } catch (error) {
      logger.error('Error in AuditLogService.logEvent:', error);
      throw error;
    }
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters = {}) {
    try {
      const query = {};

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
      logger.error('Error in AuditLogService.getAuditLogs:', error);
      throw error;
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivityLog(userId) {
    try {
      const logs = await AuditLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(100);

      return {
        userId,
        count: logs.length,
        logs
      };
    } catch (error) {
      logger.error('Error in AuditLogService.getUserActivityLog:', error);
      throw error;
    }
  }

  /**
   * Export audit report
   */
  async exportAuditReport(format = 'json', filters = {}) {
    try {
      const query = {};

      if (filters.eventType) query.eventType = filters.eventType;
      if (filters.severity) query.severity = filters.severity;
      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
      }

      const logs = await AuditLog.find(query)
        .populate('userId', 'email firstName lastName')
        .sort({ timestamp: -1 });

      if (format === 'json') {
        return {
          format: 'json',
          generatedAt: new Date(),
          totalRecords: logs.length,
          data: logs
        };
      } else if (format === 'csv') {
        // For CSV, convert to comma-separated format
        let csv = 'User Email,Event Type,Severity,Description,IP Address,Timestamp\n';
        logs.forEach(log => {
          const userData = log.userId ? `${log.userId.email}` : 'Unknown';
          csv += `"${userData}","${log.eventType}","${log.severity}","${log.description}","${log.ipAddress}","${log.timestamp}"\n`;
        });
        return {
          format: 'csv',
          generatedAt: new Date(),
          totalRecords: logs.length,
          data: csv
        };
      }

      throw new Error('Unsupported format');
    } catch (error) {
      logger.error('Error in AuditLogService.exportAuditReport:', error);
      throw error;
    }
  }

  /**
   * Get critical events
   */
  async getCriticalEvents(filters = {}) {
    try {
      const query = { severity: 'critical' };

      if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
      }

      const logs = await AuditLog.find(query)
        .populate('userId', 'email firstName lastName')
        .sort({ timestamp: -1 });

      return {
        count: logs.length,
        events: logs
      };
    } catch (error) {
      logger.error('Error in AuditLogService.getCriticalEvents:', error);
      throw error;
    }
  }

  /**
   * Clean up old logs
   */
  async cleanupOldLogs(daysOld = 90) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

      const result = await AuditLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        severity: { $ne: 'critical' }
      });

      logger.info(`Cleaned up ${result.deletedCount} old audit logs`);

      return {
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} audit logs older than ${daysOld} days`
      };
    } catch (error) {
      logger.error('Error in AuditLogService.cleanupOldLogs:', error);
      throw error;
    }
  }
}

export default new AuditLogService();
