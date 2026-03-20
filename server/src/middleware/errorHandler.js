// Error Handler Middleware
// Functionality: Global error handling, error logging, response formatting

import { CustomError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export default (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', err);

  // Handle CustomError
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        statusCode: 400
      }
    });
  }

  // Handle JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid token',
        statusCode: 401
      }
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
      statusCode: 500
    }
  });
};
