import mongoose from "mongoose";
import { IComment } from "../types/models";
const commentSchema = new mongoose.Schema<IComment>({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    mediaUrl: { type: String }
}, {
    timestamps: true,
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;