import  jwt, { JwtPayload }  from "jsonwebtoken";
import { WebSocketServer } from "ws";
import {JWT_SECRET} from '@repo/backend-common/config'
const wss =new WebSocketServer({port:8080})
wss.on("connection",function(ws,request){

    const url = request.url // request give access to url http://localhost:3000/token=1233444
    if(!url){
        return;
    }
    const queryParams= new URLSearchParams(url.split("?")[1]);//getting query parameer->split url intp array ["ttp://localhost:3000","token=1233444"],The URLSearchParams API provides read and write access to the query of a URL
    const token = queryParams.get("token") || "" //" " as jwt take string or token  and .get() return first value associated to it 
    const decodeTOken =jwt.verify(token ,JWT_SECRET);
    if(!decodeTOken ||(decodeTOken as JwtPayload).userId){// jwt return string or payload as we are sigining as object jwt.sign({}) so we get payload
//JwtPayload as we know it omming in form of object 
        ws.close();
        return;
    }
    ws.on("message",function(data){
        ws.send("pong")
    })

})