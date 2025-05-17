import {Router} from 'express';
import { controllerHandler } from '../middlewares/controllerHandler';
import postController  from '../controllers/post.controller';
import {verifyUser} from '../middlewares/verifyUser';
import {postSchema }from '../validation/schemaValidation';
// import {ValidationSchema} from '../types/types';
const postRouter = Router();

postRouter.post("/", verifyUser, controllerHandler(postController.createPost, {bodySchema : postSchema}));
postRouter.get("/:id", controllerHandler(postController.getPost));
postRouter.get("/:id", controllerHandler(postController.getUserPosts));
postRouter.delete("/:id", verifyUser, controllerHandler(postController.deletePost));

// For likes
postRouter.post("/:id/like", verifyUser, controllerHandler(postController.toggleLike));
postRouter.get("/:id/likes", verifyUser, controllerHandler(postController.getPostLikes));

export default postRouter;