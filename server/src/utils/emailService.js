// Email Service
// Functions: sendEmail(), sendVerificationEmail(), sendWarningEmail(), sendInheritanceNotification()

import nodemailer from 'nodemailer';
import logger from './logger.js';

// Configure transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
      from: process.env.EMAIL_USER,
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
      from: process.env.EMAIL_USER,
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
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
