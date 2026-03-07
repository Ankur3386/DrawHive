import { WebSocket } from "ws";
import { User } from "./User";
export class RoomManager{
   rooms:Map<number,User[]>=new Map();
  private  static instance:RoomManager;
   private constructor(){  // due to private we can't call this outside so static is linked to class not object
    this.rooms=new Map();
   }
  static getInstance(){
    if(!this.instance){
       return  this.instance=new RoomManager()
    }else{
        return this.instance
    }
   }
   addUser(roomId:number,user:User){
      if(!this.rooms.has(roomId)){
         this.rooms.set(roomId,[user]);
         return ;
      }
      this.rooms.set(roomId,[...(this.rooms.get(roomId) ?? []),user])
   }

   removeUser(roomId:number,userId:string){
      if(this.rooms.has(roomId)){
  this.rooms.set(roomId, this.rooms.get(roomId)?.filter(x=>x.userId!==userId)!)
      }
    
   }
   broadCast(roomId:number,userId:string,message:any){
      const restUser=this.rooms.get(roomId)?.filter(x=>x.userId!=userId);
      restUser?.forEach((x)=>x.send(message))
   }

}