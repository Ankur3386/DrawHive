'use client'
import { ReactNode, useEffect, useRef, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IconButton } from "./IconButton";
import {Circle, Pencil, RectangleHorizontalIcon,Eraser, Minus} from "lucide-react"
import { FaArrowRightLong } from "react-icons/fa6";
import { LuDiamond } from "react-icons/lu";
import { Game } from "../../frontend/src/app/draw/Game";
import Customize from "./customize";
export type Tool ="circle"|"rect"|"pencil"|"eraser"|"arrow"|"diamond"|"eraser"|"line"
export function Canvas({roomId,socket,token}:{
roomId:string,
socket:WebSocket,
token:string
}){
  
     const canvasRef =useRef<HTMLCanvasElement>(null);
     const[game,setGame]=useState<Game>()
     const[currShape,setShape]=useState<Tool>("circle")
     const[customize,setCustomize]=useState(false)
     const[borderColor,setBorderColor]=useState("white")
     const[fillColor,setfillColor]=useState("transparent")
     const[lineWidth,setLineWidth]=useState<number>(1)
     const[lineDash,setLineDash]=useState<{x:number,y:number}>({x:0,y:0})
 useEffect(()=>{
if(canvasRef.current){
 const canvas= canvasRef.current
  canvasRef.current.width = window.innerWidth;
  canvasRef.current.height = window.innerHeight;
 const g = new Game(canvas,roomId,socket,token);
 setGame(g)
 //return to handle double rendering and used return as it destroy when useeffect run second time or unmount 
 return()=>{
 g.destroy()
 }
}
    },[canvasRef])


    useEffect(()=>{
    game?.setTool(currShape)
  
    },[currShape,game])
    useEffect(()=>{
    game?.setStyle(borderColor,fillColor,lineDash,lineWidth)
  
    },[borderColor,fillColor,lineWidth,lineDash])
    return(
 <div className="h-[100vh] overflow-hidden relative">
  <canvas ref={canvasRef}   className="bg-white w-screen h-screen"/>

  <IoMdMenu className="absolute top-4 left-4 w-7 h-7 text-white z-10" onClick={()=>{
    setCustomize(prev=>!prev)
  }} />
  {
    customize && <Customize setBorderColor={setBorderColor} setfillColor={setfillColor} setWidth={setLineWidth} setLineDash={setLineDash}/>
  }
  <TopBar currShape={currShape} setShape={setShape} setCustomize={setCustomize}  />

</div>
    )
}
function TopBar({
  currShape,
  setShape,
  setCustomize,
}: {
  currShape: Tool
  setShape: (s: Tool) => void
  setCustomize: (prev: boolean) => void
}) {
  const tools: {
    tool: Tool
    icon: ReactNode
    label: string
    hasStyle: boolean
  }[] = [
    { tool: "pencil",  icon: <Pencil size={16} strokeWidth={1.8} />,                 label: "Draw",    hasStyle: true  },
    { tool: "rect",    icon: <RectangleHorizontalIcon size={16} strokeWidth={1.8} />, label: "Rect",    hasStyle: true  },
    { tool: "circle",  icon: <Circle size={16} strokeWidth={1.8} />,                 label: "Circle",  hasStyle: true  },
    { tool: "diamond", icon: <LuDiamond size={16} strokeWidth={1.8} />,              label: "Diamond", hasStyle: true  },
    { tool: "line",    icon: <Minus size={16} strokeWidth={1.8} />,                  label: "Line",    hasStyle: true  },
    { tool: "arrow",   icon: <FaArrowRightLong size={14} />,                         label: "Arrow",   hasStyle: true  },
    { tool: "eraser",  icon: <Eraser size={16} strokeWidth={1.8} />,                 label: "Eraser",  hasStyle: false },
  ]

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white rounded-xl shadow-md border border-gray-200">
        {tools.map(({ tool, icon, label, hasStyle }) => (
          <IconButton
            key={tool}
            icon={icon}
            label={label}
            activated={currShape === tool}
            onClick={() => {
              setShape(tool)
              setCustomize(hasStyle)
            }}
          />
        ))}
      </div>
    </div>
  )
}