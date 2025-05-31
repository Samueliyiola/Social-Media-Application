
import { NextFunction, Request, Response } from 'express';
import responseHandler from '../utils/responseHandler';
import { UserPayload } from '../types/types';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/jwtHelper';
import HttpStatus from '../utils/statusCodes';
// import "../types/express/index.d.ts";
export const verifyUser = (req : Request, res : Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the
        if(!token){
            return next(new AppError("Token not provided", HttpStatus.UNAUTHORIZED));
        }
        const decoded = verifyToken(token) as UserPayload;
        if (!decoded) {
            return next(new AppError("Invalid token", HttpStatus.UNAUTHORIZED));
        }
        res.locals.user = decoded; // Attach the user payload to the res.locals object
        next(); // Call the next middleware or route handler

    }catch(err){
        next(new AppError("Token verification failed", HttpStatus.UNAUTHORIZED));
    }
    

};

