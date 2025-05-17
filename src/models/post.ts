import mongoose from "mongoose";
import { IPost } from "../types/models";

const postSchema = new mongoose.Schema<IPost>({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String },
    likes : { type: Number, default: 0 },
    }, {
    timestamps: true,
})

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;