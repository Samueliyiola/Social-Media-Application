import mongoose from "mongoose";
import { ILike } from "../types/models";

const likeSchema = new mongoose.Schema<ILike>({
    userId: { type: String, required: true },    
    postId: { type: String, required: true }
});

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;