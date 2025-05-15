import authController from '../controllers/auth.controller';
import { controllerHandler } from '../middlewares/controllerHandler';
import {Router} from 'express';
import {verifyUser} from '../middlewares/verifyUser';
import { registerUserSchema, loginUserSchema } from '../validation/schemaValidation';

export const authRouter = Router();

authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/send-otp', verifyUser, controllerHandler(authController.sendOtp));
authRouter.post('/verify-otp', verifyUser, controllerHandler(authController.verifyOtp));
// authRouter.post('/verify-email', controllerHandler(authController.verifyEmail));