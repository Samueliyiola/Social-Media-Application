import {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    birthdate : Date;
    isVerified?: boolean;
    following?: number;
    followers?: number;
    lastSeen? : Date;
  }
  
  export interface IPost extends Document {
    _id : string;
    userId: string; 
    content: string;
    mediaUrl?: string;
    createdAt?: Date;
  }
  
  export interface IComment extends Document {
    _id: string;
    postId: string;
    userId: string;
    text: string;
    createdAt?: Date;
  }
  
  export interface ILike extends Document {
    _id: string;
    userId: string;
    postId: string;
  }
  
  export interface IMessage extends Document {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    mediaUrl?: string;
    createdAt?: Date;
    isRead?: Date;
    deleted?: boolean;
  }
  
export interface INotification extends Document {
    _id: string;
    userId: string;
    type: string; // e.g., "like", "comment", "follow"
    senderId: string;
    message?: string;
    createdAt?: Date;
  }
  
  export interface IFollow extends Document {
    _id: string;
    followerId: string;
    followingId: string;
  }
  
  export interface IBookmark extends Document {
    _id: string;
    userId: string;
    postId: string; 
    createdAt?: Date;
  }