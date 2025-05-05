import mongoose from "mongoose";
import { IComment } from "../types/models";
const commentSchema = new mongoose.Schema<IComment>({
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
}, {
    timestamps: true,
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;