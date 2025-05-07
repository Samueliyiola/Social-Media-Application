import Joi from "joi";
import AppError from "../utils/AppError";

/**
 * Validates incoming requests against a Joi schema.
 * @param schema - Joi validation schema
 * @param data - Data to validate (e.g., req.body, req.params, req.query)
 * @throws {AppError} If validation fails, throws an AppError with a status code and message.
 */
export const validateIncomingRequest = (schema: Joi.ObjectSchema, data: any) => {
  const { error } = schema.validate(data, { abortEarly: false }); // `abortEarly: false` allows for multiple validation errors to be collected

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(", ");
    throw new AppError(errorMessages, 400); // Throw a custom error with status 400 (Bad Request) and the validation error message
  }
};
