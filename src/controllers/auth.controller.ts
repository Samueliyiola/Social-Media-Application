import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import responseHandler from '../utils/responseHandler';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/models';
import AppError from '../utils/AppError';
// import mongoose from 'mongoose';
import User from '../models/user';
import { UserPayload } from '../types/types';
import  VerificationCode from '../models/verificationCode';
import {signToken, verifyToken, decodeToken} from '../utils/jwtHelper';
import { JwtPayload } from 'jsonwebtoken';
import { otpService} from '../services/otpService';
import {uploadSingleImage} from '../services/cloudinaryService';
import HttpStatus from '../utils/statusCodes';
// import "../types/express/index.d.ts";


const authController = {

    registerUser :  catchAsync(async (req: Request , res : Response, next : NextFunction): Promise<any> => {
        // const { username, email, password, profilePicture, bio, birthdate } = req.body;
        const { username, email, password, bio, birthdate } = req.body;
        const findUser = await User.findOne({ email });
        if(findUser){
            // return responseHandler.error(res, { statusCode: 409, message: "User already exists" });
            return next(new AppError("User already exists", HttpStatus.CONFLICT));
        }
        //Adding photo via cloudinary service
        let profilePictureUrl = '';
        let profilePictureId = '';

        if (req.file) {
            const uploadResult = await uploadSingleImage(req.file.buffer);
            profilePictureUrl = uploadResult.url;
            profilePictureId = uploadResult.public_id;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password : hashedPassword, profilePictureUrl, profilePictureId, bio, birthdate });
        if (!newUser) {
            // return responseHandler.error(res, { statusCode: 409, message: "User not created" });
            return next(new AppError("User not created", HttpStatus.CONFLICT)); 
        }

        // To make the password field temporary 
        // type SafeUser = Omit<IUser, 'password'>;

        const userObj = newUser.toObject();
        const { password:_, ...safeUser } = userObj;

        // const { password, ...userWithoutPassword } = userObj; // Exclude password field
        return responseHandler.success(res, HttpStatus.CREATED, { message: "User created successfully", user: safeUser });
    }),

    loginUser : catchAsync(async (req: Request , res : Response, next: NextFunction): Promise<any> => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if(!isPasswordValid){
            return next(new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED));
        }
        const token = signToken(user._id, user.email);
        return responseHandler.success(res, HttpStatus.OK, { message: "Login successful", token, user });
    }),

    getAllUsers : catchAsync(async(req: Request , res : Response, next: NextFunction): Promise<any> => {
        const users = await User.find({}) // Exclude password field
        if (!users) {
            return next(new AppError("No users found", HttpStatus.NOT_FOUND));
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Users fetched successfully", users });
    }),

    sendOtp : catchAsync(async (req: Request , res : Response, next: NextFunction): Promise<any> => {
        const user = res.locals.user;
        if(!user){
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }
        const theuser = await User.findOne({ email: user.email });
        if (!theuser) {
            return next(new AppError("User not found", 404));
        }
        await otpService(theuser);
        return responseHandler.success(res, HttpStatus.OK, { message: "OTP sent successfully" });

    }),

    verifyOtp : catchAsync(async (req: Request , res : Response, next: NextFunction): Promise<any> => {
        const { otp } = req.body;
        const theuser = res.locals.user;
        if(!theuser){
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }
        const user = await User.findOne({email: theuser.email});
        if (!user) {
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }
        const verificationCode = await VerificationCode.findOne({ userId: user._id });
        if (!verificationCode) {
            return next(new AppError("Verification code not found", HttpStatus.NOT_FOUND));
        }
        if (verificationCode.code !== otp) {
            res.json(res.locals.user);
            return next(new AppError("Invalid OTP", HttpStatus.UNAUTHORIZED));
        }
        user.isVerified = true;
        await user.save();
        return responseHandler.success(res, HttpStatus.OK, { message: "User verified successfully" });
        
})};

export default authController;