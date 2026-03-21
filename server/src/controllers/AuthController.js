// AuthController

import AuthService from "../services/AuthService.js";
import { ValidationError, AuthenticationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { CreatedResponse, OkResponse } from "../utils/successResponse.js";

class AuthController {

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new ValidationError("Name, email and password are required");
      }

      const result = await AuthService.register({ name, email, password });

      const response = new CreatedResponse(result, "User registered successfully");
      res.status(201).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.register: ", error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      const result = await AuthService.login(email, password);

      const response = new OkResponse(result, "Login successful");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.login: ", error);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      const result = await AuthService.logout(userId);

      const response = new OkResponse(result, "Logout successful");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.logout: ", error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError("Refresh token is required");
      }

      const result = await AuthService.refreshToken(refreshToken);

      const response = new OkResponse(result, "Token refreshed successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.refreshToken: ", error);
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;

      if (!token) {
        throw new ValidationError("Verification token is required");
      }

      const result = await AuthService.verifyEmail(token);

      const response = new OkResponse(result, "Email verified successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.verifyEmail: ", error);
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError("Email is required");
      }

      const result = await AuthService.forgotPassword(email);

      const response = new OkResponse(result, "Password reset email sent");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.forgotPassword: ", error);
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;

      if (!token) {
        throw new ValidationError("Reset token is required");
      }

      if (!newPassword || !confirmPassword) {
        throw new ValidationError("New password and confirmation are required");
      }

      if (newPassword !== confirmPassword) {
        throw new ValidationError("Passwords do not match");
      }

      const result = await AuthService.resetPassword(token, newPassword);

      const response = new OkResponse(result, "Password reset successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in AuthController.resetPassword: ", error);
      next(error);
    }
  }
}

export default new AuthController();
