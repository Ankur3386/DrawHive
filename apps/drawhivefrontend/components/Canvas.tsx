'use client'
import { useEffect, useRef, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IconButton } from "./IconButton";
import {Circle, Pencil, RectangleHorizontalIcon,Eraser,ArrowBigRight} from "lucide-react"
import { FaArrowRightLong } from "react-icons/fa6";
import { LuDiamond } from "react-icons/lu";
import { Game } from "../src/app/draw/Game";
import Customize from "./customize";
export type Tool ="circle"|"rect"|"pencil"|"eraser"|"arrow"|"diamond"
export function Canvas({roomId,socket}:{
roomId:string,
socket:WebSocket
}){
  
     const canvasRef =useRef<HTMLCanvasElement>(null);
     const[game,setGame]=useState<Game>()
     const[currShape,setShape]=useState<Tool>("circle")
     const[customize,setCustomize]=useState(false)
 useEffect(()=>{
if(canvasRef.current){
 const canvas= canvasRef.current
 const g = new Game(canvas,roomId,socket);
 setGame(g)
 //return to handle double rendering and used return as it destroy when useeffect run second time or unmount 
 return()=>{
 g.destroy()
 }

 
}
    },[canvasRef])


    useEffect(()=>{
    game?.setTool(currShape)//done to remove ugly logic like window.setShape  now we have a reference to game  and we are seting currShape
  
    },[currShape,game])
    return(
 <div className="h-[100vh] overflow-hidden relative">

  <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="bg-amber-400"/>

  <IoMdMenu className="absolute top-4 left-4 w-7 h-7 text-white z-10" onClick={()=>{
    setCustomize(prev=>!prev)
  }} />
  {
    customize && <Customize/>
  }

  <TopBar currShape={currShape} setShape={setShape} setCustomize={setCustomize} />

</div>
    )
}
function TopBar({currShape,setShape,setCustomize}:{currShape:Tool,setShape:(s:Tool)=>void ,setCustomize:(prev:boolean)=>void}){
  return(
 <div className="fixed  top-3 left-1/2 -translate-x-1/2 bg-slate-800 rounded-2xl ">
  <div className="flex gap-3">
   <IconButton icon={<Pencil/>} 
   onClick={()=>{
    setShape("pencil")
    setCustomize(true)
   }}
   activated={currShape==="pencil"}/>
 <IconButton icon={<RectangleHorizontalIcon/>}  onClick={()=>{
    setShape("rect")
      setCustomize(true)
   }}
   activated={currShape==="rect"}/>
 <IconButton icon={<Circle/>}  onClick={()=>{
    setShape("circle")
      setCustomize(true)
   }}
   activated={currShape==="circle"}/>
 <IconButton icon={<Eraser/>}  onClick={()=>{
    setShape("eraser")
      setCustomize(false)
   }}
   activated={currShape==="eraser"}/>
 <IconButton icon={<FaArrowRightLong />} className={'p-3'} onClick={()=>{
    setShape("arrow")
      setCustomize(true)
   }}
   activated={currShape==="arrow"}/>

 <IconButton icon={<LuDiamond />} className={'p-3 left-0'} onClick={()=>{
    setShape("diamond")
      setCustomize(true)
   }}
   activated={currShape==="diamond"}/>
  </div>
 
    </div>
  )
}