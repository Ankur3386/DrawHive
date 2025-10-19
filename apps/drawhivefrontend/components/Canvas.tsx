'use client'
import { useEffect, useRef, useState } from "react";
import { draw } from "../src/app/draw";
import { IconButton } from "./IconButton";
import {Circle, Pencil, RectangleHorizontalIcon} from "lucide-react"
import { Game } from "../src/app/draw/Game";
export type Tool ="circle"|"rect"|"pencil"
export function Canvas({roomId,socket}:{
roomId:string,
socket:WebSocket
}){
  
     const canvasRef =useRef<HTMLCanvasElement>(null);
     const[game,setGame]=useState<Game>()
     const[currShape,setShape]=useState<Tool>("circle")
 useEffect(()=>{
if(canvasRef.current){
 const canvas= canvasRef.current
 const g = new Game(canvas,roomId,socket);
 setGame(g)
 return()=>{
 g.destroy()
 }

 
}
    },[canvasRef])


    useEffect(()=>{
    game?.setTool(currShape)//done to remove ugly logic like window.setShape  now we have a reference to game  and we are seting currShape
  
    },[currShape,game])
    return(
    <div className=" h-[100vh] overflow-hidden">
      <canvas  className =" bg-amber-400"ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>  </canvas>
      {/* add a  react hook so that windoow.innerwidth become responsive*/}
         < TopBar currShape={currShape} setShape={setShape}/>
</div>
    )
}
function TopBar({currShape,setShape}:{currShape:Tool,setShape:(s:Tool)=>void}){
  return(
 <div className="fixed top-4 left-4">
  <div className="flex gap-3">
   <IconButton icon={<Pencil/>} 
   onClick={()=>{
    setShape("pencil")
   }}
   activated={currShape==="pencil"}/>
 <IconButton icon={<RectangleHorizontalIcon/>}  onClick={()=>{
    setShape("rect")
   }}
   activated={currShape==="rect"}/>
 <IconButton icon={<Circle/>}  onClick={()=>{
    setShape("circle")
   }}
   activated={currShape==="circle"}/>
  </div>
 
    </div>
  )
}