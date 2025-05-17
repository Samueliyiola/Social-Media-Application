import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';
import Like from '../models/like';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import responseHandler from '../utils/responseHandler';
import AppError from '../utils/AppError';


const commentController = {

    createComment: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;
        const postId = req.params.id;
        const { content, mediaUrl } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        const newComment = await Comment.create({ userId, postId, content, mediaUrl });
        if (!newComment) {
            return next(new AppError("Failed to create comment", 500));
        }
        return responseHandler.success(res, 201, { message: "Comment created successfully", comment: newComment });
    }),

    viewAllComments : catchAsync(async(req : Request, res: Response, next: NextFunction): Promise<any> =>{
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new AppError("Post not found!", 404));
        }
        const comments = Comment.find({postId});
        if(!comments){
            return next(new AppError("No comments found!", 404));
        }
        return responseHandler.success(res, 200, { message: "Comments fetched successfully", comments });
    }),

    deleteComment: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }
        if (comment.userId.toString() !== userId.toString()) {
            return next(new AppError("You are not authorized to delete this comment", 403));
        }
        await Comment.findByIdAndDelete(commentId);
        return responseHandler.success(res, 200, { message: "Comment deleted successfully" });
    }),

    toggleLike: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }
        const likeExists = await Like.findOne({ postId: commentId, userId });
        if(likeExists){
            await Like.findByIdAndDelete({ _id: likeExists._id });
        }
        const like = await Like.create({ userId, PostId : commentId });
        if (!like) {
            return next(new AppError("Failed to like comment", 500));
        }
        return responseHandler.success(res, 201, { message: "Comment liked successfully", like });
    }),

    getCommentLikes : catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }
        const likes = await Like.find({  postId : commentId, userId : comment.userId });
        if (!likes) {
            return next(new AppError("No likes found for this comment", 404));
        }
        const likeCount = likes.length;
        return responseHandler.success(res, 200, { message: "Likes retrieved successfully", likes, likeCount });
    })




}

export default commentController;
