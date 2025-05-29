import express from "express";
import cors from "cors"; // CORS middleware
import errorHandler from "./src/middlewares/errorHandler"; //Global error handler
const app = express();
// import "./src/@types/express/index.d";
import {authRouter} from "./src/routes/auth.routes"; // Import your routes
import {userRouter} from "./src/routes/user.routes"; // Import your routes
import postRouter from "./src/routes/post.routes"; // Import your routes
import messageRouter from "./src/routes/message.routes"; // Import message routes

app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter); 
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/messages", messageRouter); 
app.use(errorHandler);

export default app;