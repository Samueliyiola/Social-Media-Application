import mongoose from "mongoose";
import { IMessage } from "../types/models";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    mediaUrl: { type: String },
    seen: { type: Boolean, default: false },
    deleted : {type : Boolean, default : false}
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;