import { Request, Response, NextFunction } from "express";
import { ValidationSchema } from "../types/types";
import { AnyFunction, ExpressCallBackFunction } from "../types/types";
import { validateIncomingRequest } from "../validation/joiValidation";
import AppError from "../utils/AppError";
import responseHandler from "../utils/responseHandler"; 

const parseControllerArgs = (req: Request) => ({
  body: req.body,
  params: req.params,
  query: req.query,
});

export const controllerHandler = (
  controllerFunc: AnyFunction,
  schema?: ValidationSchema
): ExpressCallBackFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { body, params, query } = parseControllerArgs(req);

    try {
      // Validate if schema provided
      if (schema) {
        const { bodySchema, paramsSchema, querySchema } = schema;

        if (bodySchema) validateIncomingRequest(bodySchema, body);
        if (paramsSchema) validateIncomingRequest(paramsSchema, params);
        if (querySchema) validateIncomingRequest(querySchema, query);
      }

      // Call the actual controller logic
      const result = await controllerFunc(req, res, next);

      //Standardize successful response if controller returned something
      if (result && typeof result === "object") {
        const { code = 200, ...data } = result;
        // Check if response was already sent (to avoid setting headers after response)
        if (!res.headersSent) {
            return responseHandler.success(res, code, data);
          }else{
            return;
          }
        
      }

      //  Default success response
      // return responseHandler.success(res, 200, { message: "Operation successful" });

    } catch (err: any) {
      // Pass known/unknown errors to global error handler
      if (!(err instanceof AppError)) {
        console.error("Unexpected error:", err);
      }
      next(err);
    }
  };
};