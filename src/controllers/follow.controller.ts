import Follow from "../models/follow";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { controllerHandler } from "../middlewares/controllerHandler";
import responseHandler from "../utils/responseHandler";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
// import ExpressCallBackFunction from "../types/types";


const followController = {
    followUser: catchAsync(async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = res.locals.user.userId;
        const followUserId = req.params.id;

        if (userId === followUserId) {
            return next(new AppError ("You cannot follow yourself", 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError ("User not found", 404 ));
        }

        const follow = await Follow.create({ followerId: userId, followingId: followUserId });
        if (!follow) {
            return next( new AppError( "Failed to follow user", 500));
        }

        return responseHandler.success(res, 200, { message: "Followed successfully", follow });
    }),

    getUserFollowers: catchAsync( async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = req.params.id;
        const followers = await Follow.find({ followingId: userId });
        if (!followers) {
            return next(new AppError ("No followers found", 404));
        }
        const followerCount = await Follow.countDocuments({ followingId: userId });
        const followerIds = followers.map((follower) => follower.followerId);

        return responseHandler.success(res, 200, { message: "Followers fetched successfully", followers, followerCount, followerIds });
    }),

    getUserFollowing: catchAsync( async(req: Request, res: Response, next: NextFunction) : Promise<any> => {
        const userId = req.params.id;
        const following = await Follow.find({ followerId: userId });    
        if (!following) {
            return next(new AppError ("This user does not follow anyone!", 404));
        }
        const followingCount = await Follow.countDocuments({ followerId: userId });
        const followingIds = following.map((follow) => follow.followingId);

        return responseHandler.success(res, 200, { message: "Following fetched successfully", following, followingCount, followingIds });
    })
};


export default followController;