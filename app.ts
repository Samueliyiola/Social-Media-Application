import express from "express";
import errorHandler from "./src/middlewares/errorHandler"; //Global error handler
const app = express();
// import "./src/@types/express/index.d";
import {authRouter} from "./src/routes/auth.routes"; // Import your routes
import {userRouter} from "./src/routes/user.routes"; // Import your routes
import postRouter from "./src/routes/post.routes"; // Import your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter); 
app.use("/api/v1/posts", postRouter); 
app.use(errorHandler);

export default app;