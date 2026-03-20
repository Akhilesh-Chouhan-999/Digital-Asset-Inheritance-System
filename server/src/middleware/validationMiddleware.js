// Validation Middleware
// Functionality: Request body validation, input sanitization

import { ValidationError } from '../utils/errorHandler.js';

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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('Invalid email format');
    }
    // Implementation
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
    // Implementation
    next();
  } catch (error) {
    next(error);
  }
};
