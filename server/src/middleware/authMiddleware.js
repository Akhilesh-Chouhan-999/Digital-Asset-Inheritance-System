// Auth Middleware
// Functionality: JWT token verification, user authentication

import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/errorHandler.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AuthenticationError('No token provided');
    // Implementation
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      // Implementation to check if user is authenticated
      next();
    });
  } catch (error) {
    next(error);
  }
};
