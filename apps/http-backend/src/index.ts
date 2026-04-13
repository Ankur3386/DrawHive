import express from "express";
import  cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const app =express()
app.use(express.json());
import userRouter from "./routes/auth.route";
app.use(cors())
app.use(cookieParser())
app.use('/v1/user',userRouter);

app.listen(3005)