import Message from "../models/message";
import {verifyUser} from "../middlewares/verifyUser";
import { Request, Response, NextFunction } from "express";
import responseHandler from "../utils/responseHandler";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import HttpStatus from "../utils/statusCodes";
const messageController = {

    getConversation: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        if (!res.locals.user) {
            return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
        }
        const userId = res.locals.user.userId;
        const { receiverId } = req.params;

        if (!receiverId) {
            return next(new AppError("Receiver ID is required", HttpStatus.BAD_REQUEST));
        }

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            return responseHandler.success(res, HttpStatus.OK, { message: "No messages found", messages: [] });
        }

        return responseHandler.success(res, HttpStatus.OK, { message: "Conversation fetched successfully", messages });
    }),

  
    markMessageAsSeen : catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const messageId = req.params.id;

        const messageSeen = await Message.findById(messageId);

        if (!messageSeen || messageSeen.receiverId.toString() !== userId) {
            return next(new AppError("Message not found or you are not the receiver", HttpStatus.NOT_FOUND));
        }

        messageSeen.seen = true;
        await messageSeen.save();

        responseHandler.success(res, HttpStatus.OK, { message: "Message marked as seen successfully", messageSeen });
    }),

    getAllMessages : catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const messages = await Message.find({});
        if (!messages || messages.length === 0) {
            return responseHandler.success(res, HttpStatus.OK, { message: "No messages found", messages: [] });
        }
        return responseHandler.success(res, HttpStatus.OK, { message: "Messages fetched successfully", messages });
    })
    // sendMessage: catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    //     if(!res.locals.user) {
    //         return next(new AppError("You are not authorized to do this!", HttpStatus.UNAUTHORIZED));
    //     }
    //     const userId = res.locals.user.userId;
    //     const { receiverId, content } = req.body;
        
    //     if (!receiverId || !content) {
    //         return next(new AppError("Receiver ID and content are required", HttpStatus.BAD_REQUEST));
    //     }

    //     const newMessage = await Message.create({ senderId: userId, receiverId, content });
    //     if (!newMessage) {
    //         return next(new AppError("Failed to send message", HttpStatus.INTERNAL_SERVER_ERROR));
    //     }

    //     return responseHandler.success(res, 201, { message: "Message sent successfully", newMessage });
    // }),
}


export default messageController;