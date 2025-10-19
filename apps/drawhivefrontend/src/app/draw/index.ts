import axios from "axios"
import { HTTP_BACKEND } from "../../../config"

 type Shape={
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
 }|{
    type:"circle",
    centerX:number,
    centerY:number
    radius:number
 }|{
  type:"pencil";
  startX:number;
  startY:number;
  endX:number;
  endY:number
 }

export async function draw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
 
    const ctx=canvas.getContext('2d')
    let existingShapes:Shape[] =await getExistingShapes(roomId)
 if(!ctx){
  return;
 }
 
 socket.onmessage=(event)=>{

const message = JSON.parse(event.data)
if(message.type=='chat'){
  const messageShape =JSON.parse(message.message) ;
  
   //  {existingShapes.push(messageShape)
  //  clearCanvas(existingShapes,canvas,ctx) } // here there is a race condition case as when someone else add a new shape than my canvas drawing will go away and i have to move mouse  
  existingShapes.push(messageShape)
   clearCanvas(existingShapes,canvas,ctx) //we are doing state management as when we push a new shape than re-render  the canvas and add new shape just like how react do state  management as when a new state change than it re render 
 
 
 
}
 }
 clearCanvas(existingShapes,canvas,ctx) // render all the existing shapes
let clicked = false;
let startX=0;
let startY=0;
  canvas.addEventListener("mouseup",(e)=>{
    clicked =false;
    const width= Math.abs(e.clientX-startX);
    const height =e.clientY-startY;
    //@ts-ignore
    const currShape = window.currShape
    if(currShape=="rect"){
      const shape:Shape ={type:"rect",
        x:startX,
        y:startY,
        width,
        height
    }
    existingShapes.push(shape) ;
    socket.send(
      JSON.stringify({
        type:"chat",
        roomId,
        message:JSON.stringify(shape)// so  i am sending the shape as a string so a global stringify and then our message is no longer string so stringify that also
      })
      )
    }
    else if(currShape=="circle"){
        const shape:Shape ={type:"circle",
          radius :Math.max(width,height)/2 ,
        centerX:startX +  Math.max(width,height)/2,
        centerY:startY+ Math.max(width,height)/2,
    }
    existingShapes.push(shape)
     
    socket.send(
      JSON.stringify({
        type:"chat",
        roomId,
        message:JSON.stringify(shape)// so  i am sending the shape as a string so a global stringify and then our message is no longer string so stringify that also
      })
      )
    }
   
   
      
   
  } )
  canvas.addEventListener("mousedown",(e)=>{
    clicked = true;
   startX=e.clientX;
     startY =e.clientY
  }
) 
canvas.addEventListener("mousemove",(e)=>{

  if(clicked ==true){
const width=e.clientX-startX ;
 const height =e.clientY -startY ;
     //@ts-ignore
   const currShape =window.currShape
clearCanvas(existingShapes,canvas,ctx);
ctx.strokeStyle="rgba(255,255,255)"
if(currShape=="rect"){
ctx.strokeRect(startX,startY,Math.abs(width),height)
}
else if(currShape=="circle"){
  const radius =Math.max(width,height)/2 ;
  const centerX = startX + radius ;
  const centerY = startY +radius ;
ctx.beginPath();
ctx.arc(centerX,centerY,Math.abs(radius),0,2*Math.PI) ;
ctx.stroke();
}
 
  }
 
})
}
function  clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
 ctx?.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="rgba(0,0,0)"
 ctx.fillRect(0,0,canvas.width,canvas.height)
 existingShapes.map((shape)=>{
   if(shape.type==="rect"){
    ctx.strokeStyle="rgba(255,255,255)"
 ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)

   }
   else if(shape.type==="circle"){
    ctx.strokeStyle="rgba(255,255,255)"
    ctx.beginPath()
    ctx.arc(shape.centerX,shape.centerY,shape.radius,0,2*Math.PI);
    ctx.stroke();
   }
 })

}
async function getExistingShapes(roomId:string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.message
    const shapes =messages.map((x:{message:string})=>{
      const messageData = JSON.parse(x.message)
      return messageData
    })
    return shapes

}