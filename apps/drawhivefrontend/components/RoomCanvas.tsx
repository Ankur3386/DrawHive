"use client";

import { useEffect, useRef, useState } from "react";

import { ws_backend } from "../config";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
   
    const [socket,setSocket] =useState<WebSocket|null>(null);
    useEffect(()=>{
     const ws = new WebSocket(`${ws_backend}?token${}`)
     ws.onopen=()=>{
        setSocket(ws);
        socket?.send(
          JSON.stringify({
            type:"join_room",
            roomId
          })
        )
     }
    },[])
  if(!socket){
        return <div>Connecting to Web Socket ....</div>
    }
  return (
    <div className='h-screen w-screen'>
      <Canvas roomId={roomId} socket={socket}/>
    
    </div>
  
  )
}