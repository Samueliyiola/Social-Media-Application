import mongoose from "mongoose";
import { IBookmark } from "../types/models";

const bookmarkSchema = new mongoose.Schema<IBookmark>({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
}, {
    timestamps: true,
});

const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default Bookmark;