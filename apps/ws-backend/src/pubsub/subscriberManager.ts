import { createClient, RedisClientType } from "redis"
import { RoomManager } from "../RoomManager"
export class SubscriberManager{
private channelSubscribeTo:Map<string,string[]>
private static instance:SubscriberManager
private subscriberClient:RedisClientType
private constructor(){
    this.channelSubscribeTo=new Map()
    this.subscriberClient=createClient( {url: process.env.REDIS_URL})
    this.subscriberClient.connect()
}
static getInstance(){
    if(!this.instance){
        this.instance= new SubscriberManager()
    }
    return this.instance
}
subscribeUser(roomId:string,userId:string){
if(!this.channelSubscribeTo.has(roomId)){
    this.channelSubscribeTo.set(roomId,[])
}
this.channelSubscribeTo.get(roomId)?.push(userId)
if(this.channelSubscribeTo.get(roomId)?.length==1){
    this.subscriberClient.subscribe(roomId,(message)=>{
        this.handleMessage(roomId,message)
    })
}
}
unSubscribeUser(roomId:string,userId:string){
if(this.channelSubscribeTo.has(roomId) ){
    this.channelSubscribeTo.set(roomId,this.channelSubscribeTo.get(roomId)?.filter(id=>id!==userId)!)
}
if(this.channelSubscribeTo.get(roomId)?.length==0){
    this.subscriberClient.unsubscribe(roomId)
}
}
handleMessage(roomId:string,message:any){
RoomManager.getInstance().broadCastRedis(roomId,message)
}
}