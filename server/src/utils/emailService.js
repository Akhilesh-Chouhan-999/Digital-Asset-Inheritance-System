// Email Service
// Functions: sendVerificationEmail(), sendInactivityWarningEmail(), sendInactivityReminderEmail(), sendNomineeInheritanceNotification(), sendPasswordResetEmail(), sendNomineeVerificationEmail()

import nodemailer from 'nodemailer';
import logger from './logger.js';
import { EMAIL_PASSWORD, EMAIL_USER, FRONTEND_URL, API_URL } from './env.js';

// Validate email configuration
if (!EMAIL_USER || !EMAIL_PASSWORD) {
  logger.error('Email configuration missing: EMAIL_USER or EMAIL_PASSWORD not set in .env');
}

// Configure transporter for Gmail with App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter verification failed:', error.message);
  } else {
    logger.info('Email transporter verified successfully');
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${FRONTEND_URL}/verify-email/${token}`;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Email Verification',
      html: `
        <h2>Welcome to DAIS</h2>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>Or copy and paste this link: ${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Verification email sent to ${email}`);

  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendInactivityWarningEmail = async (email, userName, inactiveDays) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Account Inactivity Warning',
      html: `
        <h2>Account Inactivity Warning</h2>
        <p>Dear ${userName},</p>
        <p>We noticed that your account has been inactive for <strong>${inactiveDays} days</strong>.</p>
        <p>If you don't respond within the next 30 days, your digital assets will be transferred to your designated nominees.</p>
        <p><a href="${FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log In Now</a></p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Inactivity warning email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending inactivity warning email:', error);
    throw error;
  }
};

export const sendInactivityReminderEmail = async (email, userName, inactiveDays) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Final Reminder: Account Inactivity',
      html: `
        <h2>Final Reminder: Account Inactivity</h2>
        <p>Dear ${userName},</p>
        <p>This is a reminder that your account has been inactive for <strong>${inactiveDays} days</strong>.</p>
        <p>You still have time left to prevent asset transfer. Please log in immediately.</p>
        <p><a href="${FRONTEND_URL}/login" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log In Immediately</a></p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Inactivity reminder email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending inactivity reminder email:', error);
    throw error;
  }
};

export const sendNomineeInheritanceNotification = async (email, nomineeName, userFirstName, assetCount, accessToken) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Asset Inheritance Notification',
      html: `
        <h2>Asset Inheritance Notification</h2>
        <p>Dear ${nomineeName},</p>
        <p><strong>${userFirstName}</strong> has designated you as a nominee.</p>
        <p>Due to their prolonged inactivity, you now have access to <strong>${assetCount} digital assets</strong>.</p>
        <p>Your nominee account has been activated. You can now view and manage the inherited assets.</p>
        <p><a href="${FRONTEND_URL}/nominee/access?token=${accessToken}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Assets Now</a></p>
        <p>Access Token: <code>${accessToken}</code></p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Inheritance notification sent to ${email}`);
  } catch (error) {
    logger.error('Error sending inheritance notification:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your DAIS account.</p>
        <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy and paste this link: ${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendNomineeVerificationEmail = async (email, verificationToken, userFirstName) => {
  try {
    const verificationLink = `${FRONTEND_URL}/nominee/verify/${verificationToken}`;
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'DAIS - Verify Your Nominee Status',
      html: `
        <h2>Nominee Verification</h2>
        <p>Dear Nominee,</p>
        <p><strong>${userFirstName}</strong> has designated you as a nominee for their digital assets.</p>
        <p>Please verify your nominee status to be able to receive assets if needed.</p>
        <p><a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Nominee Status</a></p>
        <p>Or copy and paste this link: ${verificationLink}</p>
        <p>Best regards,<br/>DAIS Team</p>
      `
    });
    logger.info(`Nominee verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending nominee verification email:', error);
    throw error;
  }
};

// Deprecated functions maintained for backward compatibility
export const sendWarningEmail = async (email, userName) => {
  return sendInactivityWarningEmail(email, userName, 60);
};

export const sendInheritanceNotification = async (nomineeEmail, assets, userName) => {
  return sendNomineeInheritanceNotification(nomineeEmail, 'Nominee', userName, assets.length, 'token');
}
