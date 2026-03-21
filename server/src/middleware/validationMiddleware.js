// Validation Middleware
// Functionality: Request body validation, input sanitization

import { ValidationError } from '../utils/errorHandler.js';

// ===== SCHEMA VALIDATORS (used in Mongoose models) =====
// These take only the value and return boolean or promise

export const validateEmailSchema = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePasswordSchema = (password) => {
  return password && password.length >= 8;
};

// ===== EXPRESS MIDDLEWARE VALIDATORS =====
// These take (req, res, next) for route validation

export const validateRequest = (req, res, next) => {
  try {
    // Implementation to validate request body
    next();
  } catch (error) {
    next(new ValidationError('Invalid request data'));
  }
};

export const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !validateEmailSchema(email)) {
      throw new ValidationError('Invalid email format');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!validatePasswordSchema(password)) {
      throw new ValidationError('Password must be at least 8 characters');
    }
    next();
  } catch (error) {
    next(error);
  }
};
