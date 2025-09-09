import {z} from 'zod'
export const createUserSchema= z.object({
   username:z.string().min(3).max(20),
   name:z.string(),
   password:z.string(),
}) 
export const login= z.object({
   username:z.string(),
 
   password:z.string(),
}) 
export const roomSchema= z.object({
   
   name:z.string(),

}) 
