import  jwt, { JwtPayload }  from "jsonwebtoken";
import { WebSocketServer,WebSocket } from "ws";
import {JWT_SECRET} from '@repo/backend-common/config'
import {prismaClient} from '@repo/db/client'
const wss =new WebSocketServer({port:8080})

function checkUser(token:string):string|null{
 const decodeTOken =jwt.verify(token ,JWT_SECRET);
 if( typeof decodeTOken == 'string' ){
    return null;
 }
 if(decodeTOken==null || !decodeTOken.id || !decodeTOken ){
    return null;
 }

 return (decodeTOken as JwtPayload).id ;
}
interface user{
rooms:string[],
userId:string,
ws:WebSocket
}
const users:user[]=[];

wss.on("connection",function(ws,request){

    const url = request.url // request give access to url http://localhost:3000/token=1233444
    if(!url){
        return;
    }
    const queryParams= new URLSearchParams(url.split("?")[1]);//getting query parameer->split url intp array ["ttp://localhost:3000","token=1233444"],The URLSearchParams API provides read and write access to the query of a URL
    const token = queryParams.get("token") || "" //" " as jwt take string or token  and .get() return first value associated to it 
    // const decodeTOken =jwt.verify(token ,JWT_SECRET);
    // if(!decodeTOken ||(decodeTOken as JwtPayload).userId){// jwt return string or payload as we are sigining as object jwt.sign({}) so we get payload
//JwtPayload as we know it omming in form of object 
    //     ws.close();
    //     return;
    // }
    const userId = checkUser(token);
    if(!userId){
         ws.close();
       return;
    }
    users.push({
        userId,
        rooms:[],
        ws
    })
    //message will have type and roomId or type chat  and message or type leaveroom
    ws.on("message",async function(data){
       
        let parsedData ;
        if(typeof data !=="string"){
     parsedData= JSON.parse(data.toString())

        }
        else{
             parsedData= JSON.parse(data)
        }
console.log(parsedData);
       
       if(parsedData.type==="join_room"){
        const user =users.find(x=>x.ws==ws)
        user?.rooms.push(parsedData.roomId)
       }
       if(parsedData.type=="leave_room"){
        const user =users.find(x=>x.ws==ws)
        if(!user){
            return;
        }
      user&&(user.rooms=  user?.rooms.filter(x=>x!=parsedData.roomId))
       }
       if(parsedData.type==="chat"){
        const roomId =parsedData.roomId.toString()
        const message =parsedData.message
    await prismaClient.chat.create({
        data:{
            roomId:Number(roomId),
            message,
            userId
        }
    })
        users.forEach(user=>{
            if(user.rooms.includes(roomId)){
                user.ws.send(JSON.stringify({
                    type:"chat",
                    message,
                    roomId
                }
                ))
            }
        })
       }
    })

})