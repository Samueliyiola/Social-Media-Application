import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import responseHandler from '../utils/responseHandler';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/models';
import AppError from '../utils/AppError';
// import mongoose from 'mongoose';
import User from '../models/user';
import {signToken, verifyToken, decodeToken} from '../utils/jwtHelper';

const authController = {

    registerUser : catchAsync(async (req: Request , res : Response, next : NextFunction): Promise<any> => {
        const { username, email, password, profilePicture, bio, birthdate } = req.body;
        const findUser = await User.findOne({ email });
        if(findUser){
            // return responseHandler.error(res, { statusCode: 409, message: "User already exists" });
            return next(new AppError("User already exists", 409));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password : hashedPassword, profilePicture, bio, birthdate });
        if (!newUser) {
            // return responseHandler.error(res, { statusCode: 409, message: "User not created" });
            return next(new AppError("User not created", 409));
        }

        // To make the password field temporary 
        // type SafeUser = Omit<IUser, 'password'>;

        const userObj = newUser.toObject();
        const { password:_, ...safeUser } = userObj;

        // const { password, ...userWithoutPassword } = userObj; // Exclude password field
        return responseHandler.success(res, 201, { message: "User created successfully", user: safeUser });
    }),

    loginUser : async (req: Request , res : Response, next: NextFunction): Promise<any> => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("Invalid email or password", 401));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if(!isPasswordValid){
            return next(new AppError("Invalid email or password", 401));
        }
        const token = signToken(user._id, user.email);
        return responseHandler.success(res, 200, { message: "Login successful", token });
    },

    getAllUsers : async(req: Request , res : Response): Promise<any> => {
        const users = await User.find({}) // Exclude password field
        if (!users) {
            return next(new AppError("No users found", 404));
        }
        return responseHandler.success(res, 200, { message: "Users fetched successfully", users });
    }
};

export default authController;

function next(arg0: AppError): any {
    throw new Error('Function not implemented.');
}
