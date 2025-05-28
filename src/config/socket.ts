// sockets/index.ts
import { Server, Socket } from "socket.io";
import Message from "../models/message";

const onlineUsers = new Map<string, string>(); // userId -> socket.id

export default function setupSocketServer(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(" New socket connected:", socket.id);

    // 1. Register userId to socket
    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(` User ${userId} connected with socket ${socket.id}`);
    });

    // 2. Handle sending messages
    socket.on("send-message", async (data) => {
      const { senderId, receiverId, text, mediaUrl } = data;

      // Save message to DB
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        mediaUrl,
      });

      // Emit to receiver if they're online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", newMessage);
      }

      // Confirm to sender
      socket.emit("message-sent", newMessage);
    });

    // 3. Disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}
