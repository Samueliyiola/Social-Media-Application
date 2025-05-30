// socketClient.ts
import { io, Socket } from "socket.io-client";

// Replace this with your actual JWT token (e.g., after logging in)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvcmRzb25nc0BleGFtcGxlLmNvbSIsInVzZXJJZCI6IjY4MmRhMzk2ZDUxZWE0MmJmYTU1N2Y0OCIsImlhdCI6MTc0ODYwOTEwNiwiZXhwIjoxNzQ4Njk1NTA2fQ.wocUlVVEL7mEqeOezluLtSrCumK7zH40cV3w24qHU_0";

// Create the socket connection
const socket: Socket = io("http://localhost:9000", {
  auth: {
    token: token, // ✅ Must match socket.handshake.auth.token on server
  },
  transports: ["websocket"], // Optional, ensures websocket is used
});

// Handle connection success
socket.on("connect", () => {
  console.log("✅ Connected to socket server with ID:", socket.id);
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// Example: Send a message
export function sendMessage(receiverId: string, text: string, mediaUrl?: string) {
  socket.emit("send-message", { receiverId, text, mediaUrl });
}

// Example: Receive a message
socket.on("receive-message", (message) => {
  console.log("📩 New message received:", message);
});

// Example: Confirm message sent
socket.on("message-sent", (message) => {
  console.log("📤 Message successfully sent:", message);
});

// Example: User status
socket.on("user-online", (userId) => {
  console.log(`🟢 User ${userId} is online`);
});

socket.on("user-offline", (userId) => {
  console.log(`🔴 User ${userId} went offline`);
});

// Example: Mark message as seen
export function markMessageAsSeen(messageId: string) {
  socket.emit("mark-seen", { messageId });
}

// Export the socket instance for reuse
export default socket;





// import { io, Socket } from 'socket.io-client';
// import readline from 'readline';

// // ✅ Replace with your actual backend Socket.IO URL and port
// const SERVER_URL = 'http://localhost:9000';

// // ✅ Optional: JWT auth token (only if your Socket.IO setup requires it)
// const AUTH_TOKEN = 'your-jwt-token-here';

// // ✅ Replace with test sender/receiver user IDs
// const senderId = '682da396d51ea42bfa557f48';
// const receiverId = '682da382d51ea42bfa557f45';

// // Connect to your Socket.IO server
// const socket: Socket = io(SERVER_URL, {
//   transports: ['websocket'],
//   auth: {
//     token: AUTH_TOKEN,
//   },
// });

// socket.on('connect', () => {
//   console.log('✅ Connected to Socket.IO server with ID:', socket.id);

//   // Register the current user
//   socket.emit('register', senderId);
// });

// // ✅ Log incoming messages and user events
// socket.on('receive-message', (message) => {
//   console.log('📨 Message received:', message);
// });

// socket.on('message-sent', (message) => {
//   console.log('✅ Message sent:', message);
// });

// socket.on('user-online', (userId) => {
//   console.log(`🟢 User online: ${userId}`);
// });

// socket.on('user-offline', (userId) => {
//   console.log(`🔴 User offline: ${userId}`);
// });

// socket.on('disconnect', () => {
//   console.log('❌ Disconnected from server');
// });

// // 🧪 CLI input (send messages from terminal)
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// console.log(`💬 Type a message to send to ${receiverId} and press Enter...`);

// rl.on('line', (text) => {
//   socket.emit('send-message', {
//     senderId,
//     receiverId,
//     text,
//     mediaUrl: null,
//   });
// });
