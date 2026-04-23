import { WebSocket } from "ws"
import {prismaClient} from '@repo/db/client'
import { RoomManager } from "./RoomManager"
import { PublishManager } from "./pubsub/publishManager"
import { SubscriberManager } from "./pubsub/subscriberManager"

export class User{
    private ws:WebSocket
    userId:string
    roomId?:string

    constructor(ws:WebSocket, userId:string){
        this.ws=ws
        this.userId=userId
        this.init()
    }

    init(){
        this.ws.on('message', async(message:any)=>{
            try {
                const parsedData = JSON.parse(message)
                switch (parsedData.type){
                    case 'join_room':
                        const messageRoomId = parsedData.roomId
                        if(!messageRoomId){
                            this.ws.close();
                            return;
                        }
                        const room = await prismaClient.room.findFirst({
                            where:{ id: messageRoomId }
                        })
                        if(!room){
                            this.ws.close();
                            return;
                        }
                        this.roomId = room.id;
                        RoomManager.getInstance().addUser(this.roomId, this);
                        SubscriberManager.getInstance().subscribeUser(this.roomId, this.userId);
                        break;

                    case 'leave_room':
                           if (!this.roomId) {
                                    return;
                                }
                        RoomManager.getInstance().removeUser(this.roomId, this.userId);
                        SubscriberManager.getInstance().unSubscribeUser(this.roomId, this.userId);
                        break;

                    case 'chat':
                        
                        const roomId = parsedData.roomId;
                        const msg = parsedData.message;
                         if (!roomId || !msg) {
                                return;
                            }
                        await prismaClient.chat.create({
                            data:{
                                roomId: roomId,
                                message: msg,
                                userId: this.userId
                            }
                        })
                        PublishManager.getInstance().publishUser(roomId, {
                            userId: this.userId,
                            type: "chat",
                            message: msg
                        })
                        break;

                 case 'deleteChat':
    const id = parsedData.id;
    const rId = parsedData.roomId;
                if(!id || !rId){
                    return;
                }
    // find the chat row where the message JSON contains this shape id
    const chatToDelete = await prismaClient.chat.findFirst({
        where: {
            roomId: rId,
            message: {
                contains: `"id":"${id}"`
            }
        }
    })

    if(chatToDelete) {
        const deleted = await prismaClient.chat.deleteMany({
            where: { id: chatToDelete.id }
        });

        if(deleted.count > 0){
            PublishManager.getInstance().publishUser(rId, {
                userId: this.userId,
                type: "deleteChat",
                id  // send back the shape id so frontend can remove it
            });
        }
    }
    break;
                }
            } catch(e) {
                console.error("ws message error:", e)
            }
        })
    }

    send(message:any){
        this.ws.send(JSON.stringify(message))
    }
}