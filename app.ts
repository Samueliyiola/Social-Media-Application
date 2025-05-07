import express from "express";
import errorHandler from "./src/middlewares/errorHandler"; //Global error handler
const app = express();
import {authRouter} from "./src/routes/auth.routes"; // Import your routes
import {userRouter} from "./src/routes/user.routes"; // Import your routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter); // Use your routes

app.use(errorHandler);

export default app;