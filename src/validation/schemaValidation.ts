import joi from 'joi';


export const registerUserSchema = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    profilePicture: joi.string().uri(),
    bio: joi.string().max(160),
    birthdate : joi.date().required(),
    isVerified: joi.boolean().default(false),
    following: joi.number().integer().default(0),
    followers: joi.number().integer().default(0),
    lastSeen : joi.date()
});

export const loginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required()
});


export const postSchema = joi.object({
    userId: joi.string().required(),
    content: joi.string().required(),
    mediaUrl: joi.string().uri()
});

export const commentSchema = joi.object({
    postId: joi.string().required(),
    userId: joi.string().required(),
    text: joi.string().required()
});

export const likeSchema = joi.object({
    userId: joi.string().required(),
    postId: joi.string().required()
});

export const messageSchema = joi.object({
    senderId: joi.string().required(),
    receiverId: joi.string().required(),
    text: joi.string().required(),
    mediaUrl: joi.string().uri(),
    isRead: joi.date(),
    deleted: joi.boolean()
});

export const notificationSchema = joi.object({
    userId: joi.string().required(),
    type: joi.string().valid('like', 'comment', 'follow').required(),
    senderId: joi.string().required(),
    message: joi.string(),
});

export const followSchema = joi.object({
    followerId: joi.string().required(),
    followingId: joi.string().required()
});

export const bookmarkSchema = joi.object({
    userId: joi.string().required(),
    postId: joi.string().required()
});

