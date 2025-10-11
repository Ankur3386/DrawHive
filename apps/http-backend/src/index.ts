import express from "express";
import {prismaClient} from '@repo/db/client';
const app =express()
app.use(express.json());
import userRouter from "./routes/auth.route";

app.use('/v1/user',userRouter);

app.listen(3005)