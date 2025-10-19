import express from "express";
import {prismaClient} from '@repo/db/client';
import  cors from "cors"
const app =express()
app.use(express.json());
import userRouter from "./routes/auth.route";
app.use(cors())
app.use('/v1/user',userRouter);

app.listen(3005)