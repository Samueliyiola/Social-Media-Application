import Follow from "../models/follow";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import responseHandler from "../utils/responseHandler";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import HttpStatus from "../utils/statusCodes";
// import ExpressCallBackFunction from "../types/types";


const followController = {
    followUser: catchAsync(async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = res.locals.user.userId;
        const followUserId = req.params.id;

        if (userId === followUserId) {
            return next(new AppError ("You cannot follow yourself", HttpStatus.BAD_REQUEST));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError ("User not found", HttpStatus.NOT_FOUND));
        }

        const follow = await Follow.create({ followerId: userId, followingId: followUserId });
        user
        if (!follow) {
            return next( new AppError( "Failed to follow user", HttpStatus.INTERNAL_SERVER_ERROR));
        }

        return responseHandler.success(res, HttpStatus.OK, { message: "Followed successfully", follow });
    }),

    getUserFollowers: catchAsync( async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = req.params.id;
        const followers = await Follow.find({ followingId: userId });
        if (!followers) {
            return next(new AppError ("No followers found", HttpStatus.NOT_FOUND));
        }
        const followerCount = await Follow.countDocuments({ followingId: userId });
        const followerIds = followers.map((follower) => follower.followerId);

        return responseHandler.success(res, HttpStatus.OK, { message: "Followers fetched successfully", followers, followerCount, followerIds });
    }),

    getUserFollowing: catchAsync( async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = req.params.id;
        const following = await Follow.find({ followerId: userId });    
        if (!following) {
            return next(new AppError ("This user does not follow anyone!", HttpStatus.NOT_FOUND));
        }
        const followingCount = await Follow.countDocuments({ followerId: userId });
        const followingIds = following.map((follow) => follow.followingId);

        return responseHandler.success(res, HttpStatus.OK, { message: "Following fetched successfully", following, followingCount, followingIds });
    })
};


export default followController;