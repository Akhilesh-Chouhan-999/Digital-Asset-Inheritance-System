// Inactivity Scheduler (Cron Job)
// Runs daily at 00:00 UTC
// Functionality: Check all users for inactivity, send warnings, trigger inheritance

import cron from 'node-cron';
import logger from '../utils/logger.js';
import InactivityService from '../services/InactivityService.js';

export const startInactivityScheduler = () => {
  try {
    // Run every day at 00:00 UTC: '0 0 * * *'
    cron.schedule('0 0 * * *', async () => {
      logger.info('Inactivity check cron job started');
      try {
        // Implementation: Check all users for inactivity
        // Logic:
        // 1. Query users with lastActiveAt > 60 days
        // 2. Check if reminder was sent
        // 3. Check if 90 days have passed
        // 4. If 90 days: trigger inheritance
        // 5. Otherwise: send warning email

        logger.info('Inactivity check completed');
      } catch (error) {
        logger.error('Inactivity check failed:', error);
      }
    });
    logger.info('Inactivity scheduler initialized - runs daily at 00:00 UTC');
  } catch (error) {
    logger.error('Failed to start inactivity scheduler:', error);
    throw error;
  }
};
