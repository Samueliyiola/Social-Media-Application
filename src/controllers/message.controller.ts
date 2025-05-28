import Message from "../models/message";
import {verifyUser} from "../middlewares/verifyUser";
import { Request, Response, NextFunction } from "express";
import responseHandler from "../utils/responseHandler";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const messageController = {
    sendMessage: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if(!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", 401));
        }
        const userId = res.locals.user.userId;
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return next(new AppError("Receiver ID and content are required", 400));
        }

        const newMessage = await Message.create({ senderId: userId, receiverId, content });
        if (!newMessage) {
            return next(new AppError("Failed to send message", 500));
        }

        return responseHandler.success(res, 201, { message: "Message sent successfully", newMessage });
    }),
}