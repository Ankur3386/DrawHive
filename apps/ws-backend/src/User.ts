import { WebSocket } from "ws"
import {prismaClient} from '@repo/db/client'
import { RoomManager } from "./RoomManager"
export class User{
    private ws:WebSocket
    userId:string
   roomId?:number
    constructor(ws:WebSocket,userId:string){
   this.ws=ws
   this.userId=userId
   this.init()
    }
    init(){
        this.ws.on('message',async(message:any)=>{
          const parsedData =JSON.parse(message)
          switch (parsedData.type){
            case 'join_room':
              const  messageRoomId=parsedData.roomId
              if(!messageRoomId){
                this.ws.close();
                return;
              }
              const room= await prismaClient.room.findFirst({
                where:{
                     id:messageRoomId 
                }
              })
              if(!room){
                this.ws.close();
                return;
              }
              this.roomId=room.id;
          RoomManager.getInstance().addUser(this.roomId,this);
          break;
          case 'leave_room':
            RoomManager.getInstance().removeUser(this.roomId!,this.userId);
            break;
            case 'chat':
              const roomId = parsedData.roomId;
              const message= parsedData.message;
              await prismaClient.chat.create({
                  data:{
                      roomId:Number(roomId),
                      message,
                    userId:  this.userId
                    }
                })
                RoomManager.getInstance().broadCast(roomId,this.userId,{
                    type:"chat",
                    message,
                    roomId
                }
                )

          }
        })
    }

  
    send(message:any){
     this.ws.send(JSON.stringify(message))
    }
}