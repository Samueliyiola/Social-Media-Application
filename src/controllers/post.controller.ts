import Post from "../models/post"
import User from "../models/user";
import Like from "../models/like";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import responseHandler from "../utils/responseHandler";
import AppError from "../utils/AppError";

const postController = {
    createPost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;
        const {content, mediaUrl } = req.body;
        const newPost = await Post.create({ userId, content, mediaUrl });
        if (!newPost) {
            return next(new AppError("Failed to create post", 500));
        }
        return responseHandler.success(res, 201, { message: "Post created successfully", post: newPost });
    }),
    deletePost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const postId = req.params.id;
        const userId = res.locals.user.userId;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        if (post.userId.toString() !== userId.toString()) {
            return next(new AppError("You are not authorized to delete this post", 403));
        }
        await Post.findByIdAndDelete(postId);
        return responseHandler.success(res, 200, { message: "Post deleted successfully" });
    }),

    getPost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", 404));
        }
        return responseHandler.success(res, 200, { message: "Post retrieved successfully", post });
    }),
    
    getUserPosts: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        const posts = await Post.find({ userId : user._id });
        if (!posts) {
            return next(new AppError("No posts found for this user", 404));
        }
        return responseHandler.success(res, 200, { message: "Posts retrieved successfully", posts });
    }),
    // To like or unlike a post(Since same button is used for both)
    toggleLike: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;	
        const postId = req.params.id;

        const existingLike = await Like.findOne({ userId, postId });

        if (existingLike) {
            // Unlike if the user has already liked the post
            await Like.deleteOne({ _id: existingLike._id });
            await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
            return responseHandler.success(res, 200, { message: "Post unliked" });
        } else {
            // Like the post if the user has not liked it yet
            await Like.create({ userId, postId });
            await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
            return responseHandler.success(res, 200, { message: "Post liked" });
        }            
    }),

    getPostLikes: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
            const postId = req.params.id;
            const likes = await Like.find({ postId }).populate("userId", "username");
            if (!likes) {
                return next(new AppError("No likes found for this post", 404));
            }
            const likeCount = await Like.countDocuments({ postId });
            return responseHandler.success(res, 200, { message: "Likes retrieved successfully", likeCount, likes });
    }),


}

export default postController;