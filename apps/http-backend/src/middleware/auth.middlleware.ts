import { prismaClient } from '@repo/db/client';
import { Request,Response,NextFunction } from 'express'
import jwt, { JwtPayload }  from "jsonwebtoken"
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
    const token =   req.headers.authorization?.split(' ')[1]
    if(!token){
         return res.status(401).json("token not send properly");
    }
    try {
          const verifyToken=  jwt.verify(token,process.env.JWT_SECRET as string)
        if(!verifyToken){
             return res.status(401).json("token send is incorrect");
        }
    
        const userId =(verifyToken as JwtPayload).id ;
          
        req.userId =userId
        next();
    } catch (error) {
         return res.status(401).json("error fetching token");
    }
}