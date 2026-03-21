// AuthService

import { User } from "../models/index.js";
import { ValidationError, AuthenticationError, NotFoundError, ConflictError } from "../utils/errorHandler.js";
import { hashPassword, verifyPassword, generateToken, verifyJWT } from "../utils/cryptoUtils.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";
import crypto from 'crypto';

class AuthService {
  
  async register(userData) {

    try {
      const { name, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new ConflictError('User already registered with this email');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Parse name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailVerificationToken,
        emailVerified: false,
        status: 'active'
      });

      // Send verification email
      await sendVerificationEmail(email, emailVerificationToken);

      logger.info(`User registered successfully: ${email}`);

      return {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        message: 'Verification email sent. Please check your email.'
      };
    } catch (error) {
      logger.error('Error in AuthService.register:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user and include password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if email is verified
      if (!user.emailVerified) {
        throw new AuthenticationError('Please verify your email before logging in');
      }

      // Update lastActiveAt
      user.lastActiveAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateToken(
        { userId: user._id, email: user.email, role: user.role },
        '1h'
      );

      const refreshToken = generateToken(
        { userId: user._id },
        '7d'
      );

      logger.info(`User logged in: ${email}`);

      return {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Error in AuthService.login:', error);
      throw error;
    }
  }

  async logout(userId) {
    try {
      // Update user lastActiveAt

      console.log(userId)
      const user = await User.findByIdAndUpdate(
        userId,
        { lastActiveAt: new Date() },
        { new: true }
      );

      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`User logged out: ${user.email}`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Error in AuthService.logout:', error);
      throw error;
    }
  }

  async refreshToken(token) {
    try {
      // Verify refresh token
      const decoded = verifyJWT(token);

      // Generate new access token
      const newAccessToken = generateToken(
        { userId: decoded.userId },
        '1h'
      );

      logger.info(`Token refreshed for user: ${decoded.userId}`);

      return {
        accessToken: newAccessToken
      };
    } catch (error) {
      logger.error('Error in AuthService.refreshToken:', error);
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  async verifyEmail(token) {
    try {
      // Find user by verification token
      const user = await User.findOne({ emailVerificationToken: token });
      if (!user) {
        throw new NotFoundError('Invalid verification token');
      }

      // Mark email as verified
      user.emailVerified = true;
      user.emailVerificationToken = null;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);

      return {
        userId: user._id,
        email: user.email,
        message: 'Email verified successfully'
      };
    } catch (error) {
      logger.error('Error in AuthService.verifyEmail:', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists
        return { message: 'If email exists, password reset link will be sent' };
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Update user with reset token directly in database
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { 
          emailVerificationToken: resetToken,
          lastActiveAt: new Date()
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new NotFoundError('User not found');
      }

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken);

      logger.info(`Password reset email sent to: ${email}`);

      return { message: 'If email exists, password reset link will be sent' };
    } catch (error) {
      logger.error('Error in AuthService.forgotPassword:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Find user by reset token
      const user = await User.findOne({ emailVerificationToken: token });

      console.log(user)
      if (!user) {
        throw new NotFoundError('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password and clear reset token directly in database
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          emailVerificationToken: null,
          lastActiveAt: new Date()
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new NotFoundError('User not found');
      }

      logger.info(`Password reset for user: ${user.email}`);

      return {
        userId: user._id,
        email: user.email,
        message: 'Password reset successfully'
      };
    } catch (error) {
      logger.error('Error in AuthService.resetPassword:', error);
      throw error;
    }
  }
}

export default new AuthService();
