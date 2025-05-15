
import { NextFunction, Request, Response } from 'express';
import responseHandler from '../utils/responseHandler';
import { UserPayload } from '../types/types';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/jwtHelper';
// import "../types/express/index.d.ts";
export const verifyUser = (req : Request, res : Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the
    if(!token){
        return next(new AppError("Token not provided", 401));
    }
    const decoded = verifyToken(token) as UserPayload;
    if (!decoded) {
        return next(new AppError("Invalid token", 401));
    }
    res.locals.user = decoded; // Attach the user payload to the request object
    next(); // Call the next middleware or route handler

};

