"use client";

import { useEffect, useRef, useState } from "react";

import { ws_backend } from "../config";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId}:{roomId:string}){
   
    const [socket,setSocket] =useState<WebSocket|null>(null);
    useEffect(()=>{
     const ws = new WebSocket(`${ws_backend}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5NjAxOTgyLWExMjUtNDNiNS05YTM1LWYxNGZhZmQxN2MwMiIsImlhdCI6MTc2MDQ1NDY1MSwiZXhwIjoxNzYxMzE4NjUxfQ.FJ0EKR2D2_IiXaF1k-rU9D4sGmf7Fxb8ihCoHUFXN10`)
     ws.onopen=()=>{
       
        ws.send(
          JSON.stringify({
            type:"join_room",
            roomId
          })
        )
         setSocket(ws);
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
