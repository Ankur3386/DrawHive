
import { useEffect, useRef } from "react";
import { draw } from "../src/app/draw";
export function Canvas({roomId,socket}:{
roomId:string,
socket:WebSocket
}){
     const canvasRef =useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
if(canvasRef.current){
 const canvas= canvasRef.current
 draw(canvas,roomId,socket);
}
    },[canvasRef])
    
    return(
        <canvas  className =" bg-amber-400"ref={canvasRef} width={"1080"} height={"1080"}>  </canvas>
    )
}