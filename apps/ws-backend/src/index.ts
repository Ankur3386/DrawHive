import { WebSocketServer,WebSocket } from "ws";
import { User } from "./User";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()
function verifyToken(token:string){
const verifiedToken=jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload
if(verifiedToken){
    return  verifiedToken.id
}
}
const wss= new WebSocketServer({port:8080});
console.log('hi');
wss.on('connection',(ws,req)=>{
const url=req.url;
console.log("url:",url)
const gettoken= new URLSearchParams(url?.split('?')[1]);
 const token = gettoken.get('token');
 console.log(token)
 if(!token){
  ws.close();
  return;
 }
 const verifiedToken=verifyToken(token)
  const user=new User(ws,verifiedToken);

})