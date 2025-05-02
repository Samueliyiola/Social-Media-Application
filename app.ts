import express from "express";
import errorHandler from "./src/middlewares/errorHandler"; //Global error handler
const app = express();

app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


export default app;