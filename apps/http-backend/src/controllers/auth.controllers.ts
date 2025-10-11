import { JWT_SECRET } from '@repo/backend-common/config';
import {createUserSchema, login, roomSchema} from '@repo/common/types'
import {prismaClient} from '@repo/db/client'
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"


export const signup =async (req:Request,res:Response,next:NextFunction)=>{

const zod =createUserSchema.safeParse(req.body);
if(!zod.success){
    return res.json("give correct credentials")
}
console.log("hi")
const {username,password,email,name}=req.body
 const existingUser= await  prismaClient.user.findUnique({
    where:{  email}});
 if(existingUser){
      return res.json("user already exist")
 }
 
 const hashedPassword =await bcrypt.hash(password,10);
 if(!hashedPassword){
     return res.json("error hashing ppassword");
 }
 const user = await prismaClient.user.create({
    data:{
 username,
    password:hashedPassword,
    email,
    name
    }
   
 })

 if(!user){
      return res.json("error creating user");
 }
 
 const newUser = await prismaClient.user.findUnique({
    where:{
        email}});
  if(!newUser){
      return res.json("error fetching user");
 }
 return res.json({newUser,message:"user created successfully"});
}
export const signin =async(req:Request,res:Response,next:NextFunction)=>{

    const parseddata=login.safeParse(req.body);
   
    if(!parseddata.success){
         return res.json("send correct credentials ");
    }
    const user = await  prismaClient.user.findFirst({
        where:{
            email:parseddata.data.email
        }
    });
    if(!user){
      return res.json("error fetching user");
 }
    const comparePassword = await bcrypt.compare(parseddata.data.password,user.password);
    if(!comparePassword){
      return res.json("password is incorrect");
 }
 const token = jwt.sign(
    {
         id:user.id,  
    },
      JWT_SECRET,
    {
        expiresIn:"10d"
    }
 )
if(!token){
      return res.json("error creating token");
 }
 
      return res.json({user,token});
 
}
export const room =async(req:Request,res:Response,next:NextFunction)=>{
   

    const parseddata= roomSchema.safeParse(req.body);
     if(!parseddata.success){
         return res.json("send correct credentials ");
    }
   
    //@ts-ignore
    
    const userId= req.user.id;

    const room = await prismaClient.room.create({
data:{
    slug:parseddata.data.name,
    adminId: userId
}
    })
    if(!room){
        return res.status(200).json({message:"room not created successfully"})
    }
    const getroom= await prismaClient.room.findUnique({
        where:{
            id:room.id
        }
    })
   if(!getroom){
        return res.status(200).json({message:"room fetched successfully"})
    }

    return res.json(getroom);
}
export const roomChat=async(req:Request,res:Response,next:NextFunction)=>{
const roomId =Number(req.params.roomId)
const message = await prismaClient.chat.findMany({
where:{
    roomId:roomId
},
orderBy:{
    id:'desc'
},take:50
})
if(!message){
     return res.status(400).json({message:"message not found"})
}
return res.json({message})
}
export const gettRoomBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug;

 const room = await prismaClient.room.findFirst({
  where: { slug }
});

if (!room) {
  return res.status(404).json({ error: "Room not found" });
}

return res.status(200).json(room);

};
