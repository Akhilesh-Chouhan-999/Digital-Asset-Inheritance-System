// NomineeController

import NomineeService from "../services/NomineeService.js";
import { ValidationError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { CreatedResponse, OkResponse } from "../utils/successResponse.js";

class NomineeController {

  async addNominee(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { name, email, relationship, phoneNumber, address } = req.body;

      // Validate required fields
      if (!name || !email || !relationship) {
        throw new ValidationError('Name, email, and relationship are required');
      }

      const result = await NomineeService.addNominee(userId, {
        name,
        email,
        relationship,
        phoneNumber,
        address
      });

      const response = new CreatedResponse(result, "Nominee added successfully");
      res.status(201).json(response.toJSON());

    } catch (error) {
      logger.error("Error in NomineeController.addNominee: ", error);
      next(error);
    }
  }

  async getNominees(req, res, next) {
    try {
      const userId = req.user?.userId;

      const result = await NomineeService.getNominees(userId);

      const response = new OkResponse(result, "Nominees retrieved successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in NomineeController.getNominees: ", error);
      next(error);
    }
  }

  async updateNominee(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { nomineeId } = req.params;
      const { name, relationship, phoneNumber, address } = req.body;

      if (!nomineeId) {
        throw new ValidationError("Nominee ID is required");
      }

      const result = await NomineeService.updateNominee(nomineeId, userId, {
        name,
        relationship,
        phoneNumber,
        address
      });

      const response = new OkResponse(result, "Nominee updated successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in NomineeController.updateNominee: ", error);
      next(error);
    }
  }

  async deleteNominee(req, res, next) {
    try {
      const userId = req.user?.userId;
      const { nomineeId } = req.params;

      if (!nomineeId) {
        throw new ValidationError("Nominee ID is required");
      }

      const result = await NomineeService.deleteNominee(nomineeId, userId);

      const response = new OkResponse(result, "Nominee deleted successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in NomineeController.deleteNominee: ", error);
      next(error);
    }
  }

  async verifyNominee(req, res, next) {
    try {
      const { nomineeId } = req.params;
      const { token } = req.query;

      if (!nomineeId || !token) {
        throw new ValidationError("Nominee ID and verification token are required");
      }

      const result = await NomineeService.verifyNominee(nomineeId, token);

      const response = new OkResponse(result, "Nominee verified successfully");
      res.status(200).json(response.toJSON());

    } catch (error) {
      logger.error("Error in NomineeController.verifyNominee: ", error);
      next(error);
    }
  }
}

export default new NomineeController();
