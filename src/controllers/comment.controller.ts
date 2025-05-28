import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';
import Like from '../models/like';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import responseHandler from '../utils/responseHandler';
import AppError from '../utils/AppError';
import HttpStatus from '../utils/statusCodes';

const commentController = {

    createComment: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;
        const postId = req.params.id;
        const { content, mediaUrl } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", HttpStatus.NOT_FOUND));
        }
        const newComment = await Comment.create({ postId,  userId, content, mediaUrl });
        if (!newComment) {
            return next(new AppError("Failed to create comment", HttpStatus.INTERNAL_SERVER_ERROR));
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Comment created successfully", comment: newComment });
    }),

    viewAllComments : catchAsync(async(req : Request, res: Response, next: NextFunction): Promise<any> =>{
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return next(new AppError("Post not found!", HttpStatus.NOT_FOUND));
        }
        const comments = await Comment.find({postId});
        if(!comments){
            return next(new AppError("No comments found!", HttpStatus.NOT_FOUND));
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Comments fetched successfully", comments });
    }),

    deleteComment: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", HttpStatus.NOT_FOUND));
        }
        if (comment.userId.toString() !== userId.toString()) {
            return next(new AppError("You are not authorized to delete this comment", 403));
        }
        await Comment.findByIdAndDelete(commentId);
        return responseHandler.success(res, HttpStatus.OK, { message: "Comment deleted successfully" });
    }),

    toggleLike: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", HttpStatus.NOT_FOUND));
        }
        const likeExists = await Like.findOne({ postId: commentId, userId });
        if(likeExists){
            await Like.findByIdAndDelete({ _id: likeExists._id });
        }
        const like = await Like.create({ userId, postId : commentId });
        if (!like) {
            return next(new AppError("Failed to like comment", HttpStatus.INTERNAL_SERVER_ERROR));
        }
        return responseHandler.success(res, 201, { message: "Comment liked successfully", like });
    }),

    getCommentLikes : catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new AppError("Comment not found", HttpStatus.NOT_FOUND));
        }
        const likes = await Like.find({  postId : commentId, userId : comment.userId });
        if (!likes) {
            return next(new AppError("No likes found for this comment", HttpStatus.NOT_FOUND));
        }
        const likeCount = likes.length;
        return responseHandler.success(res, HttpStatus.OK, { message: "Likes retrieved successfully", likes, likeCount });
    })




}

export default commentController;
