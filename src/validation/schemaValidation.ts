import Joi from 'joi';
// import { ValidationSchema } from '../types/types';

export const registerUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    profilePicture: Joi.string().uri(),
    bio: Joi.string().max(160),
    birthdate : Joi.date().required(),
    isVerified: Joi.boolean().default(false),
    following: Joi.number().integer().default(0),
    followers: Joi.number().integer().default(0),
    lastSeen : Joi.date()
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
});


export const postSchema = Joi.object({
    content: Joi.string().required(),
    mediaUrl: Joi.string().uri()
});

export const commentSchema = Joi.object({
    postId: Joi.string().required(),
    userId: Joi.string().required(),
    text: Joi.string().required()
});

export const likeSchema = Joi.object({
    userId: Joi.string().required(),
    postId: Joi.string().required()
});

export const messageSchema = Joi.object({
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    text: Joi.string().required(),
    mediaUrl: Joi.string().uri(),
    isRead: Joi.date(),
    deleted: Joi.boolean()
});

export const notificationSchema = Joi.object({
    userId: Joi.string().required(),
    type: Joi.string().valid('like', 'comment', 'follow').required(),
    senderId: Joi.string().required(),
    message: Joi.string(),
});

export const followSchema = Joi.object({
    followerId: Joi.string().required(),
    followingId: Joi.string().required()
});

export const bookmarkSchema = Joi.object({
    userId: Joi.string().required(),
    postId: Joi.string().required()
});

