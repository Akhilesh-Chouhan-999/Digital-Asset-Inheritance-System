// NotificationService - Handles all notification delivery

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

class NotificationService {

  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send generic email notification
   */
  async sendEmailNotification(email, subject, message, htmlContent = null) {
    try {
      if (!email || !subject || !message) {
        throw new Error('Email, subject, and message are required');
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject,
        text: message,
        html: htmlContent || `<p>${message}</p>`
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info(`Email sent to ${email}, message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        email
      };
    } catch (error) {
      logger.error('Error in NotificationService.sendEmailNotification:', error);
      throw error;
    }
  }

  /**
   * Send inactivity warning email
   */
  async sendInactivityWarningEmail(email, userName, inactiveDays) {
    try {
      const subject = 'DAIS - Account Inactivity Warning';
      const message = `Dear ${userName},\n\nWe noticed that your account has been inactive for ${inactiveDays} days. ` +
        `If you don't respond within the next 30 days, your digital assets will be transferred to your designated nominees.\n\n` +
        `Please log in to your account to stay active.\n\nBest regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Account Inactivity Warning</h2>
        <p>Dear ${userName},</p>
        <p>We noticed that your account has been inactive for <strong>${inactiveDays} days</strong>.</p>
        <p>If you don't respond within the next 30 days, your digital assets will be transferred to your designated nominees.</p>
        <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log In Now</a></p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendInactivityWarningEmail:', error);
      throw error;
    }
  }

  /**
   * Send inactivity reminder email
   */
  async sendInactivityReminderEmail(email, userName, inactiveDays) {
    try {
      const subject = 'DAIS - Final Reminder: Account Inactivity';
      const message = `Dear ${userName},\n\nThis is a reminder that your account has been inactive for ${inactiveDays} days. ` +
        `You still have a few days to respond before your assets are transferred.\n\n` +
        `Please log in immediately.\n\nBest regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Final Reminder: Account Inactivity</h2>
        <p>Dear ${userName},</p>
        <p>This is a reminder that your account has been inactive for <strong>${inactiveDays} days</strong>.</p>
        <p>You still have time left to prevent asset transfer. Please log in immediately.</p>
        <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log In Immediately</a></p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendInactivityReminderEmail:', error);
      throw error;
    }
  }

  /**
   * Send nominee inheritance notification
   */
  async sendNomineeInheritanceNotification(email, nomineeName, userFirstName, assetCount, accessToken) {
    try {
      const subject = 'DAIS - Asset Inheritance Notification';
      const message = `Dear ${nomineeName},\n\n${userFirstName} has designated you as a nominee and has ${assetCount} assets that you can now access. ` +
        `Your account has been activated due to their prolonged inactivity.\n\n` +
        `Please use the provided access token to view and manage the assets.\n\nBest regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Asset Inheritance Notification</h2>
        <p>Dear ${nomineeName},</p>
        <p><strong>${userFirstName}</strong> has designated you as a nominee.</p>
        <p>Due to their prolonged inactivity, you now have access to <strong>${assetCount} digital assets</strong>.</p>
        <p>Your nominee account has been activated. You can now view and manage the inherited assets.</p>
        <p><a href="${process.env.FRONTEND_URL}/nominee/access?token=${accessToken}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Assets Now</a></p>
        <p>Access Token: <code>${accessToken}</code></p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendNomineeInheritanceNotification:', error);
      throw error;
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerificationEmail(email, verificationToken, userName = 'User') {
    try {
      const subject = 'DAIS - Verify Your Email';
      const verificationUrl = `${process.env.API_URL}/auth/verify-email/${verificationToken}`;

      const message = `Dear ${userName},\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\n` +
        `This link will expire in 24 hours.\n\nBest regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Email Verification</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for signing up with DAIS. Please verify your email address to complete your registration.</p>
        <p><a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p><code>${verificationUrl}</code></p>
        <p><small>This link will expire in 24 hours.</small></p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendEmailVerificationEmail:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetToken, userName = 'User') {
    try {
      const subject = 'DAIS - Password Reset Request';
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const message = `Dear ${userName},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetUrl}\n\n` +
        `If you didn't request this, please ignore this email.\n\nBest regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Password Reset Request</h2>
        <p>Dear ${userName},</p>
        <p>You requested a password reset for your DAIS account.</p>
        <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p><code>${resetUrl}</code></p>
        <p><small>This link will expire in 1 hour.</small></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendPasswordResetEmail:', error);
      throw error;
    }
  }

  /**
   * Send nominee verification email
   */
  async sendNomineeVerificationEmail(email, verificationToken, userFirstName = 'User') {
    try {
      const subject = 'DAIS - Verify Your Nominee Status';
      const verificationUrl = `${process.env.FRONTEND_URL}/nominee/verify/${verificationToken}`;

      const message = `Dear Nominee,\n\n${userFirstName} has added you as a nominee for their digital assets. ` +
        `Please verify your nominee status by clicking the link below:\n${verificationUrl}\n\n` +
        `Best regards,\nDAIS Team`;

      const htmlContent = `
        <h2>Nominee Verification</h2>
        <p>Dear Nominee,</p>
        <p><strong>${userFirstName}</strong> has designated you as a nominee for their digital assets.</p>
        <p>Please verify your nominee status to be able to receive assets if needed.</p>
        <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Nominee Status</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p><code>${verificationUrl}</code></p>
        <p>Best regards,<br/>DAIS Team</p>
      `;

      return await this.sendEmailNotification(email, subject, message, htmlContent);
    } catch (error) {
      logger.error('Error in NotificationService.sendNomineeVerificationEmail:', error);
      throw error;
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConnection() {
    try {
      await this.transporter.verify();
      return {
        success: true,
        message: 'Email service is properly configured'
      };
    } catch (error) {
      logger.error('Error verifying email config:', error);
      return {
        success: false,
        message: 'Email service configuration failed',
        error: error.message
      };
    }
  }
}

export default new NotificationService();
