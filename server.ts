import app from "./app";
import { createServer } from "http";
const server = createServer(app);
import dotenv from "dotenv";
import {Request, Response} from "express";
import { connectDB, disconnectDB} from "./src/config/db";
import catchAsync from "./src/utils/catchAsync";
import {Server} from "socket.io";
import setupSocketServer from "./src/config/socket";
dotenv.config();


const io = new Server(server, {
  cors: {
    origin: "*", // Set frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Set up WebSocket logic
setupSocketServer(io);


const PORT = process.env.PORT || 3000;
app.get("/", catchAsync(async(req : Request, res : Response) => {
    res.send("Hello World!");
}));
server.listen(PORT, () => {
    try{
        connectDB();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.error("Error connecting to the database", error);
    }
});