// src/config/socket.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message";

const onlineUsers = new Map<string, string>();       // userId -> socket.id
const userSocketMap = new Map<string, string>();     // socket.id -> userId

export default function setupSocketServer(io: Server) {
  // 1. Authenticate socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      next(new Error("Unauthorized socket connection"));
    }
  });

  // 2. Handle connection
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    console.log("New socket connection from user:", userId);

    // Register user
    onlineUsers.set(userId, socket.id);
    userSocketMap.set(socket.id, userId);
    socket.broadcast.emit("user-online", userId);

    // Handle sending messages
    socket.on("send-message", async (data) => {
      const senderId = socket.data.userId; // from JWT auth
      const { receiverId, text, mediaUrl } = data;

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        mediaUrl,
      });

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", newMessage);
      }

      socket.emit("message-sent", newMessage);
    });

    // socket.on("send-message", async (data) => {
    //   const { receiverId, text, mediaUrl } = data;

    //   // Use authenticated sender
    //   const senderId = userId;

    //   const newMessage = await Message.create({
    //     senderId,
    //     receiverId,
    //     text,
    //     mediaUrl,
    //   });

    //   // Send to receiver if online
    //   const receiverSocketId = onlineUsers.get(receiverId);
    //   if (receiverSocketId) {
    //     io.to(receiverSocketId).emit("receive-message", newMessage);
    //   }

    //   // Confirm to sender
    //   socket.emit("message-sent", newMessage);
    // });


    //3. To mark a message as seen
    socket.on("mark-seen", async ({ messageId }) => {
      await Message.findByIdAndUpdate(messageId, { seen: true });
    });


    //4.  Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      userSocketMap.delete(socket.id);
      console.log(`User ${userId} disconnected`);
      socket.broadcast.emit("user-offline", userId);
    });
  });
}





















// import { Server, Socket } from "socket.io";
// import Message from "../models/message";

// const onlineUsers = new Map<string, string>(); // userId -> socket.id
// const userSocketMap = new Map<string, string>(); // socket.id -> userId (for disconnect)

// export default function setupSocketServer(io: Server) {
//   io.on("connection", (socket: Socket) => {
//     console.log("New socket connected:", socket.id);

//     // 1. Register userId to socket
//     socket.on("register", (userId: string) => {
//       onlineUsers.set(userId, socket.id);
//       userSocketMap.set(socket.id, userId);
//       console.log(`User ${userId} registered with socket ${socket.id}`);

//       // Notify other users this user is online
//       socket.broadcast.emit("user-online", userId);
//     });

//     // 2. Send Message
//     socket.on("send-message", async (data) => {
//       const { senderId, receiverId, text, mediaUrl } = data;

//       const newMessage = await Message.create({
//         senderId,
//         receiverId,
//         text,
//         mediaUrl,
//       });

//       // Emit to receiver if online
//       const receiverSocketId = onlineUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("receive-message", newMessage);
//       }

//       // Confirm to sender
//       socket.emit("message-sent", newMessage);
//     });

//     // 3. Handle disconnect
//     socket.on("disconnect", () => {
//       const userId = userSocketMap.get(socket.id);

//       if (userId) {
//         onlineUsers.delete(userId);
//         userSocketMap.delete(socket.id);

//         console.log(`User ${userId} disconnected`);

//         // Notify all users this user is offline
//         socket.broadcast.emit("user-offline", userId);
//       }
//     });
//   });
// }






// // sockets/index.ts
// import { Server, Socket } from "socket.io";
// import Message from "../models/message";

// const onlineUsers = new Map<string, string>(); // userId -> socket.id

// export default function setupSocketServer(io: Server) {
//   io.on("connection", (socket: Socket) => {
//     console.log(" New socket connected:", socket.id);

//     // 1. Register userId to socket
//     socket.on("register", (userId: string) => {
//       onlineUsers.set(userId, socket.id);
//       console.log(` User ${userId} connected with socket ${socket.id}`);
//     });

//     // 2. Handle sending messages
//     socket.on("send-message", async (data) => {
//       const { senderId, receiverId, text, mediaUrl } = data;

//       // Save message to DB
//       const newMessage = await Message.create({
//         senderId,
//         receiverId,
//         text,
//         mediaUrl,
//       });

//       // Emit to receiver if they're online
//       const receiverSocketId = onlineUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("receive-message", newMessage);
//       }

//       // Confirm to sender
//       socket.emit("message-sent", newMessage);
//     });

//     // 3. Disconnect
//     socket.on("disconnect", () => {
//       for (const [userId, socketId] of onlineUsers.entries()) {
//         if (socketId === socket.id) {
//           onlineUsers.delete(userId);
//           console.log(`User ${userId} disconnected`);
//           break;
//         }
//       }
//     });
//   });
// }
