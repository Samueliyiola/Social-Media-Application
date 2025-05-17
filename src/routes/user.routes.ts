import {Router} from 'express';
import { controllerHandler } from '../middlewares/controllerHandler';
import authController  from '../controllers/auth.controller';
import postController  from '../controllers/post.controller';
export const userRouter = Router();

userRouter.get("/users", controllerHandler(authController.getAllUsers));
userRouter.get("/:username/posts", controllerHandler(postController.getUserPosts));