import { prismaClient } from '@repo/db/client';
import { Request,Response,NextFunction } from 'express'
import {JWT_SECRET} from '@repo/backend-common/config'
import jwt, { JwtPayload }  from "jsonwebtoken"
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
    const token =   req.headers.authorization?.split(' ')[1]
    if(!token){
         return res.json("token not send properly");
    }
    try {
       
        const verifyToken=  jwt.verify(token,JWT_SECRET)
        if(!verifyToken){
             return res.json("token send is incorrect");
        }
    
        const userId =(verifyToken as JwtPayload).id ;
        const user = await prismaClient.user.findUnique({
            where:{id:userId}
        }) 
        if(!user){
           return res.json("user not found so middleware is wrong "); 
        }
           // @ts-ignore
        req.user =user
        next();
        console.log("h3")
    } catch (error) {
         return res.json("error fetching token");
    }
}