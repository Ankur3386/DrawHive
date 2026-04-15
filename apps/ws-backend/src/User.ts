import { WebSocket } from "ws"
import {prismaClient} from '@repo/db/client'
import { RoomManager } from "./RoomManager"
import { PublishManager } from "./pubsub/publishManager"
import { SubscriberManager } from "./pubsub/subscriberManager"
export class User{
    private ws:WebSocket
    userId:string
   roomId?:string
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
          SubscriberManager.getInstance().subscribeUser(this.roomId,this.userId);
          break;
          case 'leave_room':
            RoomManager.getInstance().removeUser(this.roomId!,this.userId);
            SubscriberManager.getInstance().unSubscribeUser(this.roomId!,this.userId);
            break;
          case 'chat':
              const roomId = parsedData.roomId;
              const message= parsedData.message;
              await prismaClient.chat.create({
                  data:{
                      roomId:roomId,
                      message,
                    userId:  this.userId
                    }
                })
                // RoomManager.getInstance().broadCast(roomId,this.userId,{
                //     type:"chat",
                //     message,
                //     roomId
                // }) // as broadcasting through pubsub
                PublishManager.getInstance().publishUser(roomId,{userId:this.userId,type: "chat",message})
                break;
                
          case 'deleteChat':
                const id = parsedData.id;
                const rId = parsedData.roomId;
                
                await prismaClient.chat.delete({
                  where: { id }
                });

                // RoomManager.getInstance().broadCast(rId, this.userId, {
                //   type: "deleteChat",
                //   id,
                //   roomId: rId
                // });
                PublishManager.getInstance().publishUser(rId, {
                  userId: this.userId,
                  type: "deleteChat",
                  id
                });
                break;

          }
        })
    }

  
    send(message:any){
     this.ws.send(JSON.stringify(message))
    }
}