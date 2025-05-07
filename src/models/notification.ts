import mongoose from "mongoose";
import { INotification } from "../types/models";

const notificationSchema = new mongoose.Schema<INotification>({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
