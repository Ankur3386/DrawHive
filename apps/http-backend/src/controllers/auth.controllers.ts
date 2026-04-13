import {createUserSchema, loginSchema, roomSchema} from '../utils/types'
import {prismaClient} from '@repo/db/client'
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const signup =async (req:Request,res:Response,next:NextFunction)=>{
const parsedData =createUserSchema.safeParse(req.body);
if(!parsedData.success){
    return res.json("give correct credentials")
}

const { username, password, email, name } = parsedData.data;
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

    const parsedData=loginSchema.safeParse(req.body);
    
    if(!parsedData.success){
         return res.status(400).json("send correct credentials ");
    }
    console.log(parsedData)
    const user = await  prismaClient.user.findFirst({
        where:{
            email:parsedData.data.email
        }
    });
    if(!user){
      return res.status(400).json("error fetching user");
 }

 console.log(parsedData.data.password,user.password)
    const comparePassword = await bcrypt.compare(parsedData.data.password,user.password);
    
    if(!comparePassword){
      return res.status(400).json("password is incorrect");
 }

 const token = jwt.sign(
    {
         id:user.id,  
    },
      process.env.JWT_SECRET as string,
    {
        expiresIn:"10d"
    }
 )
 
if(!token){
      return res.status(400).json("error creating token");
 }
      return res.status(200).json({user,token});
 
}
export const createRoom =async(req:Request,res:Response,next:NextFunction)=>{
  const parsedData= roomSchema.safeParse(req.body);
     if(!parsedData.success){
         return res.status(400).json("send correct credentials ");
    }
    const userId= req.userId;
      if(!userId){
         return res.status(400).json("send correct credentials ");
      }
    const room = await prismaClient.room.create({
        data:{
            slug:parsedData.data.name,
            adminId: userId
}
    })
    if(!room){
        return res.status(400).json({message:"room not created successfully"})
    }
    const getroom= await prismaClient.room.findUnique({
        where:{
            id:room.id
        }
    })
   if(!getroom){
        return res.status(400).json({message:" error in fetching room "})
    }

    return res.status(200).json(getroom);
}
export const roomChat=async(req:Request,res:Response,next:NextFunction)=>{
const roomIdParam =req.params.roomId
const roomId=typeof roomIdParam==="string"?roomIdParam:roomIdParam?.[0]
if(!roomId){
  return res.status(400).json("send room Id")
}
const message = await prismaClient.chat.findMany({
where:{
    roomId:roomId
}
})

return res.status(200).json({message})
}
export const getRoomBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugParam = req.params.slug;
     const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];
     if(!slug){
     return res.status(200).json([])
        }
    const rooms = await prismaClient.room.findMany({
      where: {
        slug: {
          contains: slug,
          mode: "insensitive",
        },
      },
      take: 5,
    });
    return res.status(200).json(rooms);
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
export const dashboard=async(req:Request,res:Response,next:NextFunction)=>{
   try {
     if(!req.userId){
      return res.status(400).json({message:"userId does not exist"})
     }
 const room= await prismaClient.roomMember.findMany({
     where:{
         userId:req.userId
     },
     select:{
         room:true
     }
 })
 const  rooms= room.map(r=>r.room) 
 return res.status(200).json(rooms)
 
   } catch (error) {
      return res.status(500).json({
      error: "Internal Server Error",
    });
   }
}

export const roomOwnedByMe=async(req:Request,res:Response,next:NextFunction)=>{
   
const rooms= await prismaClient.room.findMany({
  where:{
    adminId:req.userId
         },
  select:{
    slug:true,
    id:true
  },take:10})

  const slug= rooms.map(x=>({roomId:x.id,slug:x.slug}))

  res.status(200).json(slug)
}
export const joinRoom=async(req:Request,res:Response,next:NextFunction)=>{
const roomIdParam = req.params.roomId;

console.log(typeof roomIdParam ==="string")
const roomId= typeof roomIdParam === "string" ? roomIdParam : roomIdParam?.[0];
console.log(roomId)
if(!roomId){
  return res.status(400).json("sennd correct roomId")
}

if(!req.userId){
  return res.status(400).json("sennd correct token")
}

const hasAlreadyJoined= await prismaClient.roomMember.findFirst({
  where:{
   
      roomId:roomId,
      userId:req.userId
    
  }
})
console.log("fds")
if(hasAlreadyJoined){
  return res.status(200).json("user has already joined")
}
console.log("fdssssss")
const join= await prismaClient.roomMember.create({
  data:{
    userId:req.userId,
     roomId:roomId
  }
})
if(!join){
  return res.status(400).json("error while joining user in db")
}
return res.status(200).json("user joined successfully")
}