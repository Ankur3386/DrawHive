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
  points:{startX:number ,startY:number}[];
 }|{
  type:"eraser";
  eraserArray:{startX:number ,startY:number}[]
 }|{
type:"arrow";
startX:number;
startY:number;
endX:number;
endY:number;
 }|{
  type:"diamond",
  startX:number,
  startY:number,
  endX:number,
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
private pencilPointsArray:{startX:number,startY:number}[]=[]
private eraserPointsArray:{startX:number,startY:number}[]=[]
 
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
setTool(tool:"circle"|"pencil"|"rect"|"eraser"|"arrow"|"diamond"){
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
   }else if(shape.type==="arrow"){
     var headlen = 14; // length of head in pixels
  var dx = shape.endX-shape.startX;
  var dy = shape.endY-shape.startY;
  var angle = Math.atan2(dy, dx);
  this.ctx.beginPath();
  this.ctx.moveTo(shape.startX, shape.startY);
  this.ctx.lineTo(shape.endX, shape.endY);
  this.ctx.lineTo(shape.endX - headlen * Math.cos(angle - Math.PI / 6), shape.endY - headlen * Math.sin(angle - Math.PI / 6));
  this.ctx.moveTo(shape.endX, shape.endY );
  this.ctx.lineTo(shape.endX - headlen * Math.cos(angle + Math.PI / 6), shape.endY  - headlen * Math.sin(angle + Math.PI / 6))
  this.ctx.stroke();
   }
   else if(shape.type==="pencil"){
   this.ctx.beginPath();
   for(let i=1;i<shape.points.length;i++){
     const prev = shape.points[i-1]
  const curr = shape.points[i] 
 if(!prev || !curr) continue;
  this.ctx.moveTo(prev.startX, prev.startY)
  this.ctx.lineTo(curr.startX, curr.startY)
   }

   this.ctx.stroke()
   }
   else if(shape.type==="diamond"){
    const width=shape.endX-shape.startX
    const height =shape.endY-shape.startY
  const radius =Math.max(width,height)/2 ;
  const centerX = shape.startX + radius ;
  const centerY = shape.startY +radius ;
  this.ctx.beginPath();
   this.ctx.moveTo(centerX, shape.startY)
  this.ctx.lineTo(shape.startX + width, centerY)
  this.ctx.lineTo(centerX, shape.startY + height)
  this.ctx.lineTo(shape.startX, centerY)
  this.ctx.closePath()
  this.ctx.strokeStyle="white"
  this.ctx.stroke()
   }else if(shape.type==="eraser"){
  this.ctx.beginPath()
this.ctx.globalCompositeOperation = "destination-out"
this.ctx.lineWidth = 20

for(let i=1;i<shape.eraserArray.length;i++){
 const prev=shape.eraserArray[i-1]
 const curr=shape.eraserArray[i]

 if(!prev || !curr) continue

 this.ctx.moveTo(prev.startX,prev.startY)
 this.ctx.lineTo(curr.startX,curr.startY)
}

this.ctx.stroke()
this.ctx.globalCompositeOperation="source-over"
   }
 })
 
}
mouseDownHandler=(e:any)=>{
 this.clicked = true;
   this.startX=e.clientX;
     this.startY =e.clientY
     if(this.currShape=="pencil"){
      this.pencilPointsArray.push({startX:this.startX,startY:this.startY})
     }
     if(this.currShape=="eraser"){
  this.eraserPointsArray.push({startX:e.clientX,startY:e.clientY})
}
}
mouseUpHandler=(e:any)=>{
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
      else if(currShape=="arrow"){
       const shape:Shape={
        type:"arrow",
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY
       }
    this.existingShapes.push(shape);
     this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
      }else if(this.currShape=="pencil"){
      const shape:Shape={
        type:"pencil",
        points:this.pencilPointsArray
      }
        this.existingShapes.push(shape);
     this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
    this.pencilPointsArray=[]
      }else if(this.currShape=="diamond"){
    const shape:Shape={
     type:"diamond",
     startX:this.startX,
     startY:this.startY,
     endX:e.clientX,
     endY:e.clientY
    }
    this.existingShapes.push(shape);
      this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
      }else if(this.currShape=="eraser"){
        const shape:Shape={
        type:"eraser",
        eraserArray:this.eraserPointsArray
        }
        this.existingShapes.push(shape)

this.socket.send(JSON.stringify({
  type:"chat",
  roomId:this.roomId,
  message:JSON.stringify(shape)
}))

this.eraserPointsArray=[]
      }
}
mouseMoveHandler=(e:any)=>{
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
}else if(this.currShape=="arrow"){
    var headlen = 14; // length of head in pixels
  var dx = e.clientX-this.startX;
  var dy = e.clientY-this.startY;
  var angle = Math.atan2(dy, dx);
  this.ctx.beginPath();
  this.ctx.moveTo(this.startX, this.startY);
  this.ctx.lineTo(e.clientX, e.clientY);
  this.ctx.lineTo(e.clientX - headlen * Math.cos(angle - Math.PI / 6), e.clientY - headlen * Math.sin(angle - Math.PI / 6));
  this.ctx.moveTo(e.clientX, e.clientY );
  this.ctx.lineTo(e.clientX - headlen * Math.cos(angle + Math.PI / 6), e.clientY  - headlen * Math.sin(angle + Math.PI / 6))
  this.ctx.stroke();
} else if(this.currShape=="pencil"){
this.pencilPointsArray.push({startX:e.clientX,startY:e.clientY})
this.ctx.beginPath();
for(let i=1;i<this.pencilPointsArray.length;i++){
 const prev = this.pencilPointsArray[i-1]
  const curr = this.pencilPointsArray[i] 
 if(!prev || !curr) continue;
  this.ctx.moveTo(prev.startX, prev.startY)
  this.ctx.lineTo(curr.startX, curr.startY)
}
 this.ctx.strokeStyle="white"
   this.ctx.stroke()
}else if(this.currShape=="diamond"){
 const radius =Math.max(width,height)/2 ;
  const centerX = this.startX + radius ;
  const centerY = this.startY +radius ;
  this.ctx.beginPath();
   this.ctx.moveTo(centerX, this.startY)
  this.ctx.lineTo(this.startX + width, centerY)
  this.ctx.lineTo(centerX, this.startY + height)
  this.ctx.lineTo(this.startX, centerY)
  this.ctx.closePath()
  this.ctx.strokeStyle="white"
  this.ctx.stroke()
}else if(this.currShape=="eraser"){

this.eraserPointsArray.push({startX:e.clientX,startY:e.clientY})

this.ctx.beginPath()
this.ctx.globalCompositeOperation = "destination-out"
this.ctx.lineWidth = 20

for(let i=1;i<this.eraserPointsArray.length;i++){
 const prev=this.eraserPointsArray[i-1]
 const curr=this.eraserPointsArray[i]

 if(!prev || !curr) continue

 this.ctx.moveTo(prev.startX,prev.startY)
 this.ctx.lineTo(curr.startX,curr.startY)
}

this.ctx.stroke()
this.ctx.globalCompositeOperation="source-over"
}
}
}
initMouseHandler(){
 this.canvas.addEventListener("mousedown",this.mouseDownHandler
 )

 this.canvas.addEventListener("mouseup",this.mouseUpHandler ) 


  this.canvas.addEventListener("mousemove",this.mouseMoveHandler)

}
}