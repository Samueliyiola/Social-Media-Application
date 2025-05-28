import Post from "../models/post"
import User from "../models/user";
import Like from "../models/like";
import Bookmark from "../models/bookmark";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import responseHandler from "../utils/responseHandler";
import AppError from "../utils/AppError";
import {uploadMultipleImages} from "../services/cloudinaryService";
import {deleteImages} from "../services/cloudinaryService";
import Follow from "../models/follow";
import HttpStatus from "../utils/statusCodes";

const postController = {
    createPost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;
        // const {content, mediaUrl } = req.body;
        const {content} = req.body;
        let media: { url: string; public_id: string; }[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            media = await uploadMultipleImages(req.files);
        }
        const newPost = await Post.create({ userId, content, media});
        if (!newPost) {
            return next(new AppError("Failed to create post", HttpStatus.INTERNAL_SERVER_ERROR));
        }
        return responseHandler.success(res, 201, { message: "Post created successfully", post: newPost });
    }),
    deletePost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const postId = req.params.id;
        const userId = res.locals.user.userId;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", HttpStatus.NOT_FOUND));
        }
        if (post.userId.toString() !== userId.toString()) {
            return next(new AppError("You are not authorized to delete this post", HttpStatus.FORBIDDEN));
        }
        // Delete the images from Cloudinary
        if (post.media && Array.isArray(post.media)) {
            const publicIds = post.media.map(mediaObj => mediaObj.public_id).filter(Boolean);
            if (publicIds.length > 0) {
                await deleteImages(publicIds);
            }
        }
        await Post.findByIdAndDelete(postId);
        return responseHandler.success(res, HttpStatus.OK, { message: "Post deleted successfully" });
    }),

    getPost: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new AppError("Post not found", HttpStatus.NOT_FOUND));
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Post retrieved successfully", post });
    }),
    
    getUserPosts: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }
        const posts = await Post.find({ userId : user._id });
        if (!posts) {
            return next(new AppError("No posts found for this user", HttpStatus.NOT_FOUND));
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Posts retrieved successfully", posts });
    }),
    // To like or unlike a post(Since same button is used for both)
    toggleLike: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;	
        const postId = req.params.id;

        const existingLike = await Like.findOne({ userId, postId });

        if (existingLike) {
            // Unlike if the user has already liked the post
            await Like.deleteOne({ _id: existingLike._id });
            await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
            return responseHandler.success(res, HttpStatus.OK, { message: "Post unliked" });
        } else {
            // Like the post if the user has not liked it yet
            await Like.create({ userId, postId });
            await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
            return responseHandler.success(res, HttpStatus.OK, { message: "Post liked" });
        }            
    }),

    getPostLikes: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
            const postId = req.params.id;
            const likes = await Like.find({ postId }).populate("userId", "username");
            if (!likes) {
                return next(new AppError("No likes found for this post", HttpStatus.NOT_FOUND));
            }
            const likeCount = await Like.countDocuments({ postId });
            return responseHandler.success(res, 200, { message: "Likes retrieved successfully", likeCount, likes });
    }),

    bookmarkPost : catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const {userId} = res.locals.user;
        if(!userId){
            return next(new AppError("You are not authorized to do this", HttpStatus.UNAUTHORIZED));
        }
        const user = await User.findById(userId);
        if(!user){
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }

        const postId = req.params.id;

        const post = await Post.findById(postId);   
        if(!post){
            return next(new AppError("Post not found", HttpStatus.NOT_FOUND));
        }
        const isBookmarked = await Bookmark.findOne({ userId, postId });
        if(isBookmarked){
            await Bookmark.deleteOne({ userId, postId });
            return responseHandler.success(res, HttpStatus.OK, { message: "Post unbookmarked" });
        }
        await Bookmark.create({ userId, postId });
        return responseHandler.success(res, HttpStatus.CREATED, { message: "Post bookmarked" });
      
    }),

    getTimeline : catchAsync(async(req: Request, res: Response, next: NextFunction) : Promise<any> =>{
        const {userId }= res.locals.user;
        if(!userId){
            return next(new AppError("User not found", HttpStatus.NOT_FOUND));
        }
        const follows = await Follow.find({followerId : userId });
        const followingIds = follows.map(f => f.followingId.toString());
        const timelineIds = [userId, ...followingIds];
        const timelinePosts = await Post.find({ userId : { $in : timelineIds } }).sort({ createdAt: -1 });
        return responseHandler.success(res, HttpStatus.OK, { message: "Timeline posts fetched successfully", timelinePosts });
    })


}

export default postController;