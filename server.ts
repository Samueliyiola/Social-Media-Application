import app from "./app";
import { createServer } from "http";
const server = createServer(app);
import dotenv from "dotenv";
import {Request, Response} from "express";
dotenv.config();


const PORT = process.env.PORT || 3000;	
app.get("/", (req : Request, res : Response) => {
    res.send("Hello World!");
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});