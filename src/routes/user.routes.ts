import {Router} from 'express';
import { controllerHandler } from '../middlewares/controllerHandler';
import authController  from '../controllers/auth.controller';
import postController  from '../controllers/post.controller';
import followController from '../controllers/follow.controller';
import {verifyUser} from '../middlewares/verifyUser';

export const userRouter = Router();

userRouter.get("/", controllerHandler(authController.getAllUsers));
userRouter.get("/:username/posts", controllerHandler(postController.getUserPosts));
userRouter.post("/:id/follow", verifyUser, controllerHandler(followController.followUser));
userRouter.get("/:id/followers", controllerHandler(followController.getUserFollowers));
userRouter.get("/:id/following", controllerHandler(followController.getUserFollowing));



