"use client";

import { useEffect, useRef, useState } from "react";

import { ws_backend } from "../config";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId}:{roomId:string}){
   
    const [socket,setSocket] =useState<WebSocket|null>(null);
    useEffect(()=>{
     const ws = new WebSocket(`${ws_backend}?eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2OWEzZTgyLWE0MzktNDdmNy1iOTBkLWNiYTFkMDY0MDBmOSIsImlhdCI6MTc3Mjc5NDcwNSwiZXhwIjoxNzczNjU4NzA1fQ.YpUEzCrDl66YnrrFAkgVkVNjf3Z9jsuilU8iRk4QGCE`)
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
