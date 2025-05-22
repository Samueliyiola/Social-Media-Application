import authController from '../controllers/auth.controller';
import { controllerHandler } from '../middlewares/controllerHandler';
import {Router} from 'express';
import {verifyUser} from '../middlewares/verifyUser';
import { registerUserSchema, loginUserSchema } from '../validation/schemaValidation';
import {uploadProfilePicture} from "../middlewares/upload";

export const authRouter = Router();

authRouter.post('/register', uploadProfilePicture, controllerHandler(authController.registerUser, { bodySchema: registerUserSchema }));
authRouter.post('/login', controllerHandler(authController.loginUser, { bodySchema: loginUserSchema }));
authRouter.post('/send-otp', verifyUser, controllerHandler(authController.sendOtp));
authRouter.post('/verify-otp', verifyUser, controllerHandler(authController.verifyOtp));
// authRouter.post('/verify-email', controllerHandler(authController.verifyEmail));