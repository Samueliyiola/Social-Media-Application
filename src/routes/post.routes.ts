import {Router} from 'express';
import { controllerHandler } from '../middlewares/controllerHandler';
import postController  from '../controllers/post.controller';
import commentController from "../controllers/comment.controller";
import {verifyUser} from '../middlewares/verifyUser';
import {postSchema }from '../validation/schemaValidation';
import { uploadPostImages } from '../middlewares/upload';
// import {ValidationSchema} from '../types/types';
const postRouter = Router();

postRouter.post("/", verifyUser, uploadPostImages,  controllerHandler(postController.createPost, {bodySchema : postSchema}));
postRouter.get("/:id", controllerHandler(postController.getPost));
postRouter.get("/:id", controllerHandler(postController.getUserPosts));
postRouter.delete("/:id", verifyUser, controllerHandler(postController.deletePost));

// For likes
postRouter.post("/:id/like", verifyUser, controllerHandler(postController.toggleLike));
postRouter.get("/:id/likes", verifyUser, controllerHandler(postController.getPostLikes));

// For Comments
postRouter.post("/:id/comments", verifyUser, controllerHandler(commentController.createComment));
postRouter.get("/:id/comments", controllerHandler(commentController.viewAllComments));
postRouter.delete("/comments/:id", verifyUser, controllerHandler(commentController.deleteComment));
postRouter.post("/comments/:id/like", verifyUser, controllerHandler(commentController.toggleLike));
postRouter.get("/comments/:id/likes", verifyUser, controllerHandler(commentController.getCommentLikes));

// To get the timeline of posts
postRouter.get("/timeline", verifyUser, controllerHandler(postController.getTimeline));

// To bookmark a post
postRouter.post("/:id/bookmark", verifyUser, controllerHandler(postController.bookmarkPost));
export default postRouter;