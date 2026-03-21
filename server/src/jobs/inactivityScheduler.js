// Inactivity Scheduler (Cron Job)
// Runs daily at 00:00 UTC
// Functionality: Check all users for inactivity, send warnings, trigger inheritance

import cron from 'node-cron';
import logger from '../utils/logger.js';
import InactivityService from '../services/InactivityService.js';
import { User } from '../models/index.js';

export const startInactivityScheduler = () => {
  try {
    // Run every day at 00:00 UTC: '0 0 * * *'
    cron.schedule('0 0 * * *', async () => {
      logger.info('Inactivity check cron job started');
      try {
        // Get all active users
        const users = await User.find({ status: 'active' });

        let processedUsers = 0;
        let warningsFound = 0;
        let triggersActived = 0;

        for (const user of users) {
          try {
            const result = await InactivityService.checkInactivity(user._id);
            processedUsers++;

            if (result.status === 'warning_sent' || result.caseState === 'warning_sent') {
              warningsFound++;
            }
            if (result.caseState === 'triggered') {
              triggersActived++;
            }
          } catch (error) {
            logger.error(`Error checking inactivity for user ${user._id}:`, error);
          }
        }

        logger.info(
          `Inactivity check completed. Processed: ${processedUsers} users, ` +
          `Warnings: ${warningsFound}, Triggers: ${triggersActived}`
        );
      } catch (error) {
        logger.error('Inactivity check failed:', error);
      }
    });

    // Also run a cleanup job to remove old resolved cases (runs weekly)
    cron.schedule('0 2 * * 0', async () => {
      logger.info('Inactivity case cleanup job started');
      try {
        // Could optionally delete very old resolved cases here
        logger.info('Inactivity case cleanup completed');
      } catch (error) {
        logger.error('Inactivity case cleanup failed:', error);
      }
    });

    logger.info('Inactivity scheduler initialized - runs daily at 00:00 UTC');
  } catch (error) {
    logger.error('Failed to start inactivity scheduler:', error);
    throw error;
  }
};

// Alternative: Create a separate function to manually trigger inactivity check for testing
export const triggerManualInactivityCheck = async () => {
  logger.info('Manual inactivity check triggered');
  try {
    const users = await User.find({ status: 'active' });

    let results = [];
    for (const user of users) {
      try {
        const result = await InactivityService.checkInactivity(user._id);
        results.push(result);
      } catch (error) {
        logger.error(`Error checking inactivity for user ${user._id}:`, error);
        results.push({
          userId: user._id,
          error: error.message
        });
      }
    }

    logger.info(`Manual inactivity check completed for ${results.length} users`);
    return results;
  } catch (error) {
    logger.error('Manual inactivity check failed:', error);
    throw error;
  }
};
