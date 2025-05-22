import mongoose from "mongoose";

import { IUser } from "../types/models";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePictureUrl: { type: String },
    profilePictureId: { type: String },
    bio: { type: String },
    birthdate : { type : Date, required : true},
    isVerified: { type: Boolean, default: false },
    lastSeen : {type : Date}
  },
  {
    timestamps: true,
  }
);

const User =  mongoose.model<IUser>("User", userSchema);

export default User;
