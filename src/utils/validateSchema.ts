import { Request, Response } from "express";
import { ValidationSchema } from "../types/types";
import { validateIncomingRequest } from "../validation/joiValidation";
import responseHandler from "../utils/responseHandler";

// Utility function for validation
export const validateSchema = async (
  schema: ValidationSchema | undefined,
  body: any,
  params: any,
  query: any,
  res: Response
) => {
  if (schema) {
    const { bodySchema, paramsSchema, querySchema } = schema;

    // Validate body
    if (bodySchema) {
      try {
        await validateIncomingRequest(bodySchema, body);
      } catch (validationError) {
        return responseHandler.error(res, { statusCode: 400, message: validationError instanceof Error ? validationError.message : "Validation error occurred" });
      }
    }

    // Validate params
    if (paramsSchema) {
      try {
        await validateIncomingRequest(paramsSchema, params);
      } catch (validationError) {
        return responseHandler.error(res, { statusCode: 400, message: validationError instanceof Error ? validationError.message : "Validation error occurred" });
      }
    }

    // Validate query
    if (querySchema) {
      try {
        await validateIncomingRequest(querySchema, query);
      } catch (validationError) {
        return responseHandler.error(res, { statusCode: 400, message: validationError instanceof Error ? validationError.message : "Validation error occurred" });
      }
    }
  }
};
