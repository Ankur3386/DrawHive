import { createClient, RedisClientType } from "redis"

export class PublishManager{
 private static instance:PublishManager
 publisherClient:RedisClientType
 private constructor(){
 this.publisherClient=createClient( {url: process.env.REDIS_URL})
 this.publisherClient.connect()
 }  
 static getInstance(){
    if(!this.instance){
      this.instance=new PublishManager()  
    }
    return this.instance
 } 
 publishUser(roomId:string,message:any){
 this.publisherClient.publish(roomId,JSON.stringify(message))
 }
}