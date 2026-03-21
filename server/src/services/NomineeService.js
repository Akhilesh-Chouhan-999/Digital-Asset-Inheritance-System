// NomineeService

import { Nominee, User } from "../models/index.js";
import { ValidationError, NotFoundError, AuthorizationError, ConflictError } from "../utils/errorHandler.js";
import { sendNomineeVerificationEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";
import crypto from 'crypto';

class NomineeService {

  async addNominee(userId, nomineeData) {
    try {
      const { name, email, relationship, phoneNumber, address } = nomineeData;

      // Validate required fields
      if (!name || !email || !relationship) {
        throw new ValidationError('Name, email, and relationship are required');
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if nominee already exists for this user
      const existingNominee = await Nominee.findOne({ userId, email });
      if (existingNominee) {
        throw new ConflictError('Nominee with this email already exists');
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create nominee
      const nominee = await Nominee.create({
        userId,
        name,
        email,
        relationship,
        phoneNumber: phoneNumber || null,
        address: address || {},
        verificationToken,
        verificationStatus: 'pending'
      });

      // Send verification email
      await sendNomineeVerificationEmail(email, verificationToken, user.firstName);

      logger.info(`Nominee added: ${nominee._id} for user: ${userId}`);

      return {
        nomineeId: nominee._id,
        name: nominee.name,
        email: nominee.email,
        relationship: nominee.relationship,
        verificationStatus: nominee.verificationStatus,
        createdAt: nominee.createdAt,
        message: 'Nominee added. Verification email sent.'
      };
    } catch (error) {
      logger.error('Error in NomineeService.addNominee:', error);
      throw error;
    }
  }

  async getNominees(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const nominees = await Nominee.find({ userId })
        .select('-verificationToken')
        .sort({ createdAt: -1 });

      logger.info(`Retrieved ${nominees.length} nominees for user: ${userId}`);

      return {
        count: nominees.length,
        nominees: nominees
      };
    } catch (error) {
      logger.error('Error in NomineeService.getNominees:', error);
      throw error;
    }
  }

  async updateNominee(nomineeId, userId, nomineeData) {
    try {
      const nominee = await Nominee.findById(nomineeId);

      if (!nominee) {
        throw new NotFoundError('Nominee not found');
      }

      // Check ownership
      if (nominee.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to update this nominee');
      }

      // Update allowed fields
      if (nomineeData.name) nominee.name = nomineeData.name;
      if (nomineeData.relationship) nominee.relationship = nomineeData.relationship;
      if (nomineeData.phoneNumber !== undefined) nominee.phoneNumber = nomineeData.phoneNumber;
      if (nomineeData.address) nominee.address = { ...nominee.address, ...nomineeData.address };

      nominee.updatedAt = new Date();
      await nominee.save();

      logger.info(`Nominee updated: ${nomineeId} for user: ${userId}`);

      return {
        nomineeId: nominee._id,
        name: nominee.name,
        email: nominee.email,
        relationship: nominee.relationship,
        verificationStatus: nominee.verificationStatus,
        updatedAt: nominee.updatedAt,
        message: 'Nominee updated successfully'
      };
    } catch (error) {
      logger.error('Error in NomineeService.updateNominee:', error);
      throw error;
    }
  }

  async deleteNominee(nomineeId, userId) {
    try {
      const nominee = await Nominee.findById(nomineeId);

      if (!nominee) {
        throw new NotFoundError('Nominee not found');
      }

      // Check ownership
      if (nominee.userId.toString() !== userId) {
        throw new AuthorizationError('Not authorized to delete this nominee');
      }

      await Nominee.deleteOne({ _id: nomineeId });

      logger.info(`Nominee deleted: ${nomineeId} for user: ${userId}`);

      return {
        nomineeId: nominee._id,
        message: 'Nominee deleted successfully'
      };
    } catch (error) {
      logger.error('Error in NomineeService.deleteNominee:', error);
      throw error;
    }
  }

  async verifyNominee(nomineeId, token) {
    try {
      const nominee = await Nominee.findOne({ _id: nomineeId, verificationToken: token });

      if (!nominee) {
        throw new NotFoundError('Invalid verification token or nominee not found');
      }

      // Mark as verified
      nominee.verificationStatus = 'verified';
      nominee.verificationToken = null;
      nominee.verificationDate = new Date();
      await nominee.save();

      logger.info(`Nominee verified: ${nomineeId}`);

      return {
        nomineeId: nominee._id,
        name: nominee.name,
        email: nominee.email,
        verificationStatus: nominee.verificationStatus,
        message: 'Nominee verified successfully'
      };
    } catch (error) {
      logger.error('Error in NomineeService.verifyNominee:', error);
      throw error;
    }
  }

  async getInheritanceHistory(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const nominees = await Nominee.find({ userId })
        .select('name email relationship verificationStatus verificationDate createdAt')
        .sort({ verificationDate: -1 });

      logger.info(`Retrieved inheritance history for user: ${userId}`);

      return {
        count: nominees.length,
        nominees: nominees,
        message: 'Inheritance history retrieved'
      };
    } catch (error) {
      logger.error('Error in NomineeService.getInheritanceHistory:', error);
      throw error;
    }
  }
}

export default new NomineeService();
