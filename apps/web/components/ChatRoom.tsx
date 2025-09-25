import axios from "axios"
import { http_Backend } from "../app/room/[slug]/config"
import ChatRoomClient from "./ChatRoomClient"

async function getMessage(roomId:string){
    const response = await axios.get(`${http_Backend}/chats/${roomId}`)
    console.log("hi",response.data)
    return response.data.message
}


export default async function ChatRoom({id}:{
    id:string
}) {
    const message = await getMessage(id) ;
    console.log(message)
    return(
        <ChatRoomClient id={id}  messages={message}/>
    )
}