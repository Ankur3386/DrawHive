'use client'
import {useSocket} from '../hooks/useSocket'
import { useEffect, useState } from "react";
 
export default function ChatRoomClient({messages,id}:{
    messages:{message:string}[],
    id:string
}){
 const [chats ,setChats] =useState(messages)
    const {loading,socket} =useSocket() ;
    const [currentMessage,setCurrentMessage] =useState('')
useEffect(()=>{
    if(socket && ! loading){
        socket.send(JSON.stringify({
            type:"join_room" ,
             roomId:id
        }))
        socket.onmessage=(e)=>{
          const parsedData = JSON.parse(e.data)
          if(parsedData.type == 'chat'){
            setChats((c)=>[...c ,{message:parsedData.message}])
          }
        }
    }
},[socket,loading,id])



return(
    <div>
        {chats.map((m,id)=> <div key={id}>  {m.message} </div>)}
        <input type="text" value={currentMessage} onChange={(e)=>{
            setCurrentMessage(e.target.value)
        }} />
        <button onClick={()=>{
            socket?.send(JSON.stringify({ type:'chat',
                roomId:id ,
                message:currentMessage
            })) ; 
            
    setCurrentMessage("");
        }}>Send Message</button>
    </div>
)
}
