import { Tool } from "../../../components/Canvas";
import { getExistingShapes } from "./http";

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


export class Game{

private ctx :CanvasRenderingContext2D ;
private canvas:HTMLCanvasElement ;
private existingShapes:Shape[] ;
private roomId:string;
socket:WebSocket ;
clicked:boolean ;
startX:number;
startY:number;
private currShape:Tool ="circle"

 
constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
this.canvas=canvas ;
this.ctx = canvas.getContext('2d')!;
this.existingShapes=[];
this.socket=socket;
this.roomId=roomId 
this.clicked=false;
this.startX=0;
this.startY=0;
this.init();
this.initHandler();
this.initMouseHandler();


}
destroy(){
this.canvas.removeEventListener("mousedown",this.mouseDownHandler
 )

 this.canvas.removeEventListener("mouseup",this.mouseUpHandler ) 


  this.canvas.removeEventListener("mousemove",this.mouseMoveHandler)

}
setTool(tool:"circle"|"pencil"|"rect"){
this.currShape=tool ;
}
async  init(){
  
 this.existingShapes= await getExistingShapes(this.roomId)
 this.clearCanvas() ;
}

initHandler(){
this.socket.onmessage=(event)=>{

const message = JSON.parse(event.data)
if(message.type=='chat'){
  const messageShape =JSON.parse(message.message) ;
  
   //  {existingShapes.push(messageShape)
  //  clearCanvas(existingShapes,canvas,ctx) } // here there is a race condition case as when someone else add a new shape than my canvas drawing will go away and i have to move mouse  
  this.existingShapes.push(messageShape)
   this.clearCanvas() //we are doing state management as when we push a new shape than re-render  the canvas and add new shape just like how react do state  management as when a new state change than it re render  
}
 }
}

clearCanvas(){
   this.ctx?.clearRect(0,0,this.canvas.width,this.canvas.height);
 this.ctx.fillStyle="rgba(0,0,0)"
 this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
 this.existingShapes.map((shape)=>{
   if(shape.type==="rect"){
    this.ctx.strokeStyle="rgba(255,255,255)"
 this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)

   }
   else if(shape.type==="circle"){
    this.ctx.strokeStyle="rgba(255,255,255)"
    this.ctx.beginPath()
    this.ctx.arc(shape.centerX,shape.centerY,shape.radius,0,2*Math.PI);
    this.ctx.stroke();
   }
 })
 
}
mouseDownHandler=(e)=>{
 this.clicked = true;
   this.startX=e.clientX;
     this.startY =e.clientY
}
mouseUpHandler=(e)=>{
this.clicked =false;
    const width= Math.abs(e.clientX-this.startX);
    const height =e.clientY-this.startY;
    //@ts-ignore
    const currShape = this.currShape
    console.log(currShape)
    if(currShape=="rect"){
      const shape:Shape ={type:"rect",
        x:this.startX,
        y:this.startY,
        width,
        height
    }
    this.existingShapes.push(shape) ;
    this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message:JSON.stringify(shape)// so  i am sending the shape as a string so a global stringify and then our message is no longer string so stringify that also
      })
      )
    }
    else if(currShape=="circle"){
        const shape:Shape ={type:"circle",
          radius :Math.max(width,height)/2 ,
        centerX:this.startX +  Math.max(width,height)/2,
        centerY:this.startY+ Math.max(width,height)/2,
    }
    this.existingShapes.push(shape)
     
    this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message:JSON.stringify(shape)// so  i am sending the shape as a string so a global stringify and then our message is no longer string so stringify that also
      }))}
}
mouseMoveHandler=(e)=>{
if(this.clicked ==true){
const width=e.clientX-this.startX ;
 const height =e.clientY -this.startY ;
     //@ts-ignore
   const currShape =this.currShape
this.clearCanvas();
this.ctx.strokeStyle="rgba(255,255,255)"
if(currShape=="rect"){
this.ctx.strokeRect(this.startX,this.startY,Math.abs(width),height)
}
else if(currShape=="circle"){
  const radius =Math.max(width,height)/2 ;
  const centerX = this.startX + radius ;
  const centerY = this.startY +radius ;
this.ctx.beginPath();
this.ctx.arc(centerX,centerY,Math.abs(radius),0,2*Math.PI) ;
this.ctx.stroke();
} }
}
initMouseHandler(){
 this.canvas.addEventListener("mousedown",this.mouseDownHandler
 )

 this.canvas.addEventListener("mouseup",this.mouseUpHandler ) 


  this.canvas.addEventListener("mousemove",this.mouseMoveHandler)

}
}