import mongoose from "mongoose";
import { IFollow } from "../types/models";

const followSchema = new mongoose.Schema<IFollow>({
    followerId: { type: String, required: true },
    followingId: { type: String, required: true },
}, {
    timestamps: true,
})

const Follow = mongoose.model<IFollow>("Follow", followSchema);

export default Follow;