import {Router} from 'express';
import { controllerHandler } from '../middlewares/controllerHandler';
import authController  from '../controllers/auth.controller';

export const userRouter = Router();

userRouter.get("/users", controllerHandler(authController.getAllUsers));



