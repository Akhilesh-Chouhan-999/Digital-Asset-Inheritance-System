// Email Service
// Functions: sendVerificationEmail(), sendWarningEmail(), sendInheritanceNotification(), sendPasswordResetEmail()

import nodemailer from 'nodemailer';
import logger from './logger.js';
import { EMAIL_PASSWORD, EMAIL_USER, FRONTEND_URL } from './env.js';

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
    const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a></p>`
    });
    logger.info(`Verification email sent to ${email}`);

  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendWarningEmail = async (email, userName) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Inactivity Warning from DAIS',
      html: `<p>Hello ${userName}, your account will trigger inheritance process due to inactivity.</p>`
    });
    logger.info(`Warning email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending warning email:', error);
    throw error;
  }
};

export const sendInheritanceNotification = async (nomineeEmail, assets, userName) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: nomineeEmail,
      subject: 'Digital Asset Inheritance Notification',
      html: `<p>You have been notified as a nominee for ${userName}'s digital assets.</p>`
    });
    logger.info(`Inheritance notification sent to ${nomineeEmail}`);
  } catch (error) {
    logger.error('Error sending inheritance notification:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};
