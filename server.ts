import app from "./app";
import { createServer } from "http";
const server = createServer(app);
import dotenv from "dotenv";
import {Request, Response} from "express";
import { connectDB, disconnectDB} from "./src/config/db";
import catchAsync from "./src/utils/catchAsync";
dotenv.config();


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