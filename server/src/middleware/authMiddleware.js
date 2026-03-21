// Auth Middleware
// Functionality: JWT token verification, user authentication

import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';
import { JWT_SECRET_KEY } from '../utils/env.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    next(new AuthenticationError('Invalid or expired token'));
  }
};

export const requireAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed:', error.message);
    next(new AuthenticationError('Not authenticated'));
  }
};
