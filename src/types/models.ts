export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    birthdate : Date;

  }
  
  export interface IPost {
    id : string;
    userId: string; 
    content: string;
    mediaUrl?: string;
    createdAt?: Date;
  }
  
  export interface IComment {
    id: string;
    postId: string;
    userId: string;
    text: string;
    createdAt?: Date;
  }
  
  export interface ILike {
    id: string;
    userId: string;
    postId: string;
  }
  
  export interface IMessage {
    senderId: string;
    receiverId: string;
    text: string;
    mediaUrl?: string;
    createdAt?: Date;
    isRead?: Date;
    deleted?: boolean;
  }
  