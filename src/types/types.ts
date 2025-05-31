import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * A reusable type for any controller function
 * that returns a Promise.
 */
export type AnyFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * A standard Express middleware type.
 * Used for functions like controllerHandler.
 */
export type ExpressCallBackFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;


// Define the ValidationSchema interface for type-checking
export interface ValidationSchema {
  bodySchema?: Joi.ObjectSchema;  // Schema for validating the request body
  paramsSchema?: Joi.ObjectSchema; // Schema for validating the request params
  querySchema?: Joi.ObjectSchema;  // Schema for validating the request query
}

// Define the UserPayload interface for JWT payload
export interface UserPayload {
  userId: string; // User ID
  email: string; // User email
  iat?: number; // Issued at time (optional)
  exp?: number; // Expiration time (optional)
}