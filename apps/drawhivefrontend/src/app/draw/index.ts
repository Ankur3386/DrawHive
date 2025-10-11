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
   clearCanvas(existingShapes,canvas,ctx) //we are doing state amanagement as when we push a new shape than re-render  the canvas and add new shape just like how react do state  management as when a new state change than it re render 
 
 
 
}
 }
 clearCanvas(existingShapes,canvas,ctx) // render all the existing shapes
let clicked = false;
let startX=0;
let startY=0;
  canvas.addEventListener("mouseup",(e)=>{
    clicked =false;
    const width= e.clientX-startX;
    const height =e.clientY-startY
    const shape:Shape ={type:"rect",
        x:startX,
        y:startY,
        width,
        height
    }
    existingShapes.push(shape)
    socket.send(
      JSON.stringify({
        type:"chat",
        message:JSON.stringify(shape)// so  i am sending the shape as a string so a global stringify and then our message is no longer string so stringify that also
      })
      )
   
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
clearCanvas(existingShapes,canvas,ctx);
ctx.strokeStyle="rgb30(255,255,255)"
 ctx?.strokeRect(startX,startY,width,height)
  }
 
})
}
function  clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
 ctx?.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="rgba(0,0,0)"
 ctx.fillRect(0,0,canvas.width,canvas.height)
 existingShapes.map((shape)=>{
   if(shape.type=="rect"){
    ctx.strokeStyle="rgba(255,255,255)"
 ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)

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