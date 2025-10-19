import axios from "axios";
import { HTTP_BACKEND } from "../../../config";

export async function getExistingShapes(roomId:string){
  console.log("hi")
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.message
    console.log(messages)
    const shapes =messages.map((x:{message:string})=>{
      const messageData = JSON.parse(x.message)
      return messageData
    })
    return shapes

}