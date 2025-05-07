import authController from '../controllers/auth.controller';
import { controllerHandler } from '../middlewares/controllerHandler';
import {Router} from 'express';
import { registerUserSchema, loginUserSchema } from '../validation/schemaValidation';

export const authRouter = Router();

authRouter.post('/register', controllerHandler(authController.registerUser, { bodySchema: registerUserSchema }));
authRouter.post('/login', controllerHandler(authController.loginUser, {bodySchema: loginUserSchema}));
// authRouter.post('/verify-email', controllerHandler(authController.verifyEmail));