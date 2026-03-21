// InactivityService (Dead Man's Switch)

import { User, InactivityCase, VerificationEvent, Asset, Nominee } from "../models/index.js";
import { NotFoundError, ValidationError, AuthorizationError } from "../utils/errorHandler.js";
import { sendInactivityWarningEmail, sendInactivityReminderEmail, sendNomineeInheritanceNotification } from "../utils/emailService.js";
import logger from "../utils/logger.js";
import crypto from 'crypto';

class InactivityService {

  // Check inactivity for a specific user
  async checkInactivity(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Calculate days inactive
      const lastActive = new Date(user.lastActiveAt);
      const now = new Date();
      const inactiveDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

      // Find or create inactivity case
      let inactivityCase = await InactivityCase.findOne({ userId, state: { $ne: 'resolved' } });

      if (!inactivityCase) {
        if (inactiveDays >= 60) {
          // Initialize new inactivity case
          inactivityCase = await this.initializeInactivityMonitoring(userId);
        } else {
          return {
            userId,
            inactiveDays,
            status: 'monitoring',
            message: 'User is still active'
          };
        }
      }

      // Update inactivity case
      inactivityCase.inactiveDays = inactiveDays;
      inactivityCase.lastCheckedAt = new Date();

      // Check thresholds and trigger actions
      if (inactiveDays >= inactivityCase.thresholdDays) {
        // Trigger inheritance
        if (inactivityCase.state !== 'triggered') {
          await this.triggerInheritance(userId);
        }
      } else if (inactiveDays >= 60) {
        // Send warning or reminder
        if (!inactivityCase.firstWarningAt) {
          // First warning at 60 days
          inactivityCase.state = 'warning_sent';
          inactivityCase.firstWarningAt = new Date();
          inactivityCase.nextActionAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
          await sendInactivityWarningEmail(user.email, user.firstName, inactiveDays);
        } else {
          // Send reminder every 7 days
          const daysSinceFirstWarning = Math.floor((now - inactivityCase.firstWarningAt) / (1000 * 60 * 60 * 24));
          if (daysSinceFirstWarning % 7 === 0) {
            inactivityCase.state = 'reminder_sent';
            inactivityCase.lastReminderAt = new Date();
            inactivityCase.nextActionAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await sendInactivityReminderEmail(user.email, user.firstName, inactiveDays);
          }
        }
      }

      await inactivityCase.save();

      logger.info(`Inactivity checked for user: ${userId}, inactive days: ${inactiveDays}`);

      return {
        userId,
        inactiveDays,
        caseState: inactivityCase.state,
        thresholdDays: inactivityCase.thresholdDays,
        message: `User inactive for ${inactiveDays} days`
      };
    } catch (error) {
      logger.error('Error in InactivityService.checkInactivity:', error);
      throw error;
    }
  }

  // Initialize inactivity monitoring for a user
  async initializeInactivityMonitoring(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if case already exists
      let inactivityCase = await InactivityCase.findOne({ userId });
      if (inactivityCase) {
        return inactivityCase;
      }

      // Create new inactivity case
      inactivityCase = await InactivityCase.create({
        userId,
        state: 'monitoring',
        thresholdDays: 90, // Default 90 days
        lastCheckedAt: new Date()
      });

      logger.info(`Inactivity monitoring initialized for user: ${userId}`);

      return inactivityCase;
    } catch (error) {
      logger.error('Error in InactivityService.initializeInactivityMonitoring:', error);
      throw error;
    }
  }

  // Send warning notification
  async sendWarningNotification(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const lastActive = new Date(user.lastActiveAt);
      const now = new Date();
      const inactiveDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

      await sendInactivityWarningEmail(user.email, user.firstName, inactiveDays);

      logger.info(`Warning notification sent to user: ${userId}`);

      return {
        userId,
        message: 'Warning notification sent'
      };
    } catch (error) {
      logger.error('Error in InactivityService.sendWarningNotification:', error);
      throw error;
    }
  }

  // Trigger inheritance process
  async triggerInheritance(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Update inactivity case
      const inactivityCase = await InactivityCase.findOne({ userId, state: { $ne: 'resolved' } });
      if (!inactivityCase) {
        throw new NotFoundError('Inactivity case not found');
      }

      inactivityCase.state = 'triggered';
      inactivityCase.triggeredAt = new Date();
      await inactivityCase.save();

      // Get all nominees
      const nominees = await Nominee.find({ userId, verificationStatus: 'verified' });

      if (nominees.length === 0) {
        logger.warn(`No verified nominees found for user: ${userId}`);
        return {
          userId,
          message: 'No verified nominees to notify'
        };
      }

      // Get all accessible assets
      const accessibleAssets = await Asset.find({
        userId,
        status: 'active',
        $or: [
          { visibility: 'on_death' },
          { visibility: 'nominee_only' }
        ]
      });

      // Send notifications to nominees
      for (const nominee of nominees) {
        const accessToken = crypto.randomBytes(32).toString('hex');

        // Create verification event
        await VerificationEvent.create({
          userId,
          nomineeId: nominee._id,
          inactivityCaseId: inactivityCase._id,
          type: 'nominee_notification',
          channel: 'email',
          recipient: nominee.email,
          status: 'sent'
        });

        // Send notification email
        await sendNomineeInheritanceNotification(
          nominee.email,
          nominee.name,
          user.firstName,
          accessibleAssets.length,
          accessToken
        );
      }

      logger.info(`Inheritance triggered for user: ${userId}, notified ${nominees.length} nominees`);

      return {
        userId,
        nomineesNotified: nominees.length,
        assetsAccessible: accessibleAssets.length,
        message: 'Inheritance triggered and nominees notified'
      };
    } catch (error) {
      logger.error('Error in InactivityService.triggerInheritance:', error);
      throw error;
    }
  }

  // Resolve inactivity case (when user becomes active again)
  async resolveCase(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const inactivityCase = await InactivityCase.findOne({ userId, state: { $ne: 'resolved' } });
      if (!inactivityCase) {
        throw new NotFoundError('No active inactivity case found');
      }

      // Update case
      inactivityCase.state = 'resolved';
      inactivityCase.resolvedAt = new Date();
      inactivityCase.resolutionReason = 'User became active';
      await inactivityCase.save();

      // Update user activity
      user.lastActiveAt = new Date();
      await user.save();

      logger.info(`Inactivity case resolved for user: ${userId}`);

      return {
        userId,
        caseState: inactivityCase.state,
        message: 'Inactivity case resolved'
      };
    } catch (error) {
      logger.error('Error in InactivityService.resolveCase:', error);
      throw error;
    }
  }

  // Get inactivity status for user
  async getInactivityStatus(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const lastActive = new Date(user.lastActiveAt);
      const now = new Date();
      const inactiveDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));

      const inactivityCase = await InactivityCase.findOne({ userId });

      return {
        userId,
        lastActive,
        inactiveDays,
        isActive: inactiveDays < 60,
        caseExists: !!inactivityCase,
        caseState: inactivityCase?.state || 'none',
        thresholdDays: inactivityCase?.thresholdDays || 90
      };
    } catch (error) {
      logger.error('Error in InactivityService.getInactivityStatus:', error);
      throw error;
    }
  }

  // Mark user as active again
  async markUserActive(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { lastActiveAt: new Date() },
        { new: true }
      );

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Try to resolve any active inactivity case
      const inactivityCase = await InactivityCase.findOne({ userId, state: { $ne: 'resolved' } });
      if (inactivityCase) {
        inactivityCase.state = 'resolved';
        inactivityCase.resolvedAt = new Date();
        inactivityCase.resolutionReason = 'User marked as active';
        await inactivityCase.save();
      }

      logger.info(`User marked as active: ${userId}`);

      return {
        userId,
        lastActive: user.lastActiveAt,
        message: 'User marked as active'
      };
    } catch (error) {
      logger.error('Error in InactivityService.markUserActive:', error);
      throw error;
    }
  }

  // Get inactivity history
  async getInactivityHistory(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const history = await InactivityCase.find({ userId })
        .sort({ createdAt: -1 });

      return {
        userId,
        count: history.length,
        history
      };
    } catch (error) {
      logger.error('Error in InactivityService.getInactivityHistory:', error);
      throw error;
    }
  }
}

export default new InactivityService();
