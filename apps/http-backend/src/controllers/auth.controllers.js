import {createUserSchema} from '@repo/common/types'

const signup =(req,res,next)=>{

const zod =createUserSchema.safeParse(req.body);
if(!zod.success){
    return res.json("give correct credentials")
}
const {username,password,email}=req.body
 const existingUser= await 
}