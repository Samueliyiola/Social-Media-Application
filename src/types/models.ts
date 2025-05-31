import {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    // profilePicture?: string;
    profilePictureUrl?: { type: String },
    profilePictureId?: { type: String },
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    birthdate : Date;
    isVerified?: boolean;
    lastSeen? : Date;
  }
  
  export interface IPost extends Document {
    _id : string;
    userId: string; 
    content: string;
    likes: number;
    // mediaUrl?: string;
    media?: { url: string; public_id: string }[];
    createdAt?: Date;
  }
  
  export interface IComment extends Document {
    _id: string;
    postId: string;
    userId: string;
    content: string;
    likes: number;
    mediaUrl?: string;
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
    media?: { url: string; public_id: string }[];
    createdAt?: Date;
    seen?: boolean;
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

  export interface IVerificationCode extends Document {
    _id: string;
    userId: string;
    code : number;
    expiryTime: Date;
  }
