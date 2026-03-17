import { Tool } from "../../../components/Canvas";
import { getExistingShapes } from "./http";
type Style={
  lineWidth:number,
  borderColor:string,
  fillColor:string,
  lineDash:[number,number],
}
 type Shape=({
    type:"rect",
    id:string,
    x:number,
    y:number,
    width:number,
    height:number
 }& Style)|({
    type:"circle",
     id:string,
    centerX:number,
    centerY:number
    radius:number
 }&Style)|({
  type:"pencil";
   id:string,
  points:{startX:number ,startY:number}[];
 }&Style)|{
  type:"eraser";
  id:string,
 }|({
type:"arrow";
 id:string,
startX:number;
startY:number;
endX:number;
endY:number;
 }&Style)|({
  type:"diamond",
   id:string,
  startX:number,
  startY:number,
  endX:number,
  endY:number
 }&Style)|({
  type:"line",
  id:string,
 startX:number,
  startY:number,
  endX:number,
  endY:number
 }&Style)


export class Game{

private ctx :CanvasRenderingContext2D ;
private canvas:HTMLCanvasElement ;
private existingShapes:Shape[] ;
private roomId:string;
socket:WebSocket ;
clicked:boolean ;
startX:number;
startY:number;
private currShape:Tool ="circle";
private pencilPointsArray:{startX:number,startY:number}[]=[];
private borderColor:string="white";
private lineWidth:number=1;
private fillColor:string="black";
private lineDash:[number,number]=[0,0]
 
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
setTool(tool:"circle"|"pencil"|"rect"|"eraser"|"arrow"|"diamond"|"line"){
this.currShape=tool ;
}

setStyle(borderColor:string,fillColor:string,lineDash:{x:number,y:number},lineWidth:number){
this.borderColor=borderColor
this.fillColor=fillColor
console.log(lineDash)
this.lineDash=[lineDash.x,lineDash.y]
this.lineWidth=lineWidth

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
 if(shape.type === "rect") {
  this.ctx.lineWidth = shape.lineWidth
  this.ctx.setLineDash(shape.lineDash)
  this.ctx.fillStyle = shape.fillColor
  this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
  this.ctx.beginPath()  
  this.ctx.strokeStyle = shape.borderColor
  this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
}
   else if(shape.type==="circle"){
    this.ctx.beginPath()
     this.ctx.lineWidth=shape.lineWidth
     this.ctx.setLineDash(shape.lineDash)
    this.ctx.arc(shape.centerX,shape.centerY,shape.radius,0,2*Math.PI);
    this.ctx.fillStyle=shape.fillColor
    this.ctx.fill()
    this.ctx.strokeStyle=shape.borderColor
    this.ctx.stroke();
   }else if(shape.type==="arrow"){
     var headlen = 14; // length of head in pixels
  var dx = shape.endX-shape.startX;
  var dy = shape.endY-shape.startY;
  var angle = Math.atan2(dy, dx);
  this.ctx.beginPath();
   this.ctx.lineWidth=shape.lineWidth
   this.ctx.setLineDash(shape.lineDash)
  this.ctx.moveTo(shape.startX, shape.startY);
  this.ctx.lineTo(shape.endX, shape.endY);
  this.ctx.lineTo(shape.endX - headlen * Math.cos(angle - Math.PI / 6), shape.endY - headlen * Math.sin(angle - Math.PI / 6));
  this.ctx.moveTo(shape.endX, shape.endY );
  this.ctx.lineTo(shape.endX - headlen * Math.cos(angle + Math.PI / 6), shape.endY  - headlen * Math.sin(angle + Math.PI / 6))
  this.ctx.strokeStyle=shape.borderColor
  this.ctx.stroke();
   }
   else if(shape.type==="pencil"){
   this.ctx.beginPath();
    this.ctx.lineWidth=shape.lineWidth
    this.ctx.setLineDash(shape.lineDash)
   for(let i=1;i<shape.points.length;i++){
     const prev = shape.points[i-1]
  const curr = shape.points[i] 
 if(!prev || !curr) continue;
  this.ctx.moveTo(prev.startX, prev.startY)
  this.ctx.lineTo(curr.startX, curr.startY)
   }
   this.ctx.strokeStyle=shape.borderColor
   this.ctx.stroke()
   }
   else if(shape.type==="diamond"){
    const width=shape.endX-shape.startX
    const height =shape.endY-shape.startY
  const radius =Math.max(width,height)/2 ;
  const centerX = shape.startX + radius ;
  const centerY = shape.startY +radius ;
  this.ctx.beginPath();
   this.ctx.lineWidth=shape.lineWidth
   this.ctx.setLineDash(shape.lineDash)
   this.ctx.moveTo(centerX, shape.startY)//top
     this.ctx.lineTo(shape.startX + width, centerY)//right
  this.ctx.lineTo(centerX, shape.startY + height)//bottom

    this.ctx.lineTo(shape.startX, centerY)//left

this.ctx.fillStyle=shape.fillColor
this.ctx.fill()
    this.ctx.strokeStyle=shape.borderColor
  this.ctx.stroke()
   this.ctx.closePath()
   }else if(shape.type==="line"){
   this.ctx.beginPath();
    this.ctx.lineWidth=shape.lineWidth;
    this.ctx.setLineDash(shape.lineDash)
   this.ctx.moveTo(shape.startX,shape.startY)
   this.ctx.lineTo(shape.endX,shape.endY)
  
  this.ctx.strokeStyle=shape.borderColor
  this.ctx.stroke()
   }
 })
 
}
mouseDownHandler=(e:any)=>{
 this.clicked = true;
   this.startX=e.clientX;
     this.startY =e.clientY
     console.log(this.lineDash)
     if(this.currShape=="pencil"){
      this.pencilPointsArray.push({startX:this.startX,startY:this.startY})
     }else if(this.currShape=="eraser"){
        let x=e.clientX
        let y=e.clientY
     
        let id=""
        for(let i=this.existingShapes.length-1;i>=0;i--){
          const shape=this.existingShapes[i]
           if(!shape){
            continue ;
           }
           let bool= this.isPointInsideShape(shape,x,y)
           
           if(bool){
              id = shape.id
            this.existingShapes.splice(i,1);
            this.clearCanvas()
            break;
           }
        }
        if(id!==""){
             this.socket.send(
      JSON.stringify({
        type:"deleteChat",
        roomId:this.roomId,
        id:id  
      })
)
        }
     
      }
}
mouseUpHandler=(e:any)=>{
this.clicked =false;
    const width= Math.abs(e.clientX-this.startX);
    const height =e.clientY-this.startY;
    //@ts-ignore
    const currShape = this.currShape
   
    if(currShape=="rect"){
     
      const shape:Shape ={type:"rect",
        id:crypto.randomUUID(),
        x:this.startX,
        y:this.startY,
        width,
        height,
      borderColor:this.borderColor,
      fillColor:this.fillColor,
    lineWidth:this.lineWidth,
      lineDash:this.lineDash
    
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
             id:crypto.randomUUID(),
          radius :Math.max(width,height)/2 ,
        centerX:this.startX +  Math.max(width,height)/2,
        centerY:this.startY+ Math.max(width,height)/2,
        fillColor:this.fillColor,
        borderColor:this.borderColor,
        lineDash:this.lineDash,
        lineWidth:this.lineWidth
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
           id:crypto.randomUUID(),
        startX:this.startX,
        startY:this.startY,
        endX:e.clientX,
        endY:e.clientY,
         fillColor:this.fillColor,
        borderColor:this.borderColor,
        lineDash:this.lineDash,
        lineWidth:this.lineWidth
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
           id:crypto.randomUUID(),
        points:this.pencilPointsArray,
         fillColor:this.fillColor,
        borderColor:this.borderColor,
        lineDash:this.lineDash,
        lineWidth:this.lineWidth
      }
        this.existingShapes.push(shape);
     this.socket.send(
      JSON.stringify({
        type:"chat",
           id:crypto.randomUUID(),
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
    this.pencilPointsArray=[]
      }else if(this.currShape=="diamond"){
    const shape:Shape={
     type:"diamond",
        id:crypto.randomUUID(),
     startX:this.startX,
     startY:this.startY,
     endX:e.clientX,
     endY:e.clientY,
      fillColor:this.fillColor,
        borderColor:this.borderColor,
        lineDash:this.lineDash,
        lineWidth:this.lineWidth
    }
    this.existingShapes.push(shape);
      this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
      }else if(this.currShape=="line"){
        const shape:Shape={
      type:"line",
      id:crypto.randomUUID(),
     startX:this.startX,
     startY:this.startY,
     endX:e.clientX,
     endY:e.clientY,
      fillColor:this.fillColor,
        borderColor:this.borderColor,
        lineDash:this.lineDash,
        lineWidth:this.lineWidth
    }
     this.existingShapes.push(shape);
      this.socket.send(
      JSON.stringify({
        type:"chat",
        roomId:this.roomId,
        message: JSON.stringify(shape)
      })
)
      }
}
mouseMoveHandler=(e:any)=>{
if(this.clicked ==true){
const width=e.clientX-this.startX ;
 const height =e.clientY -this.startY ;
     //@ts-ignore
   const currShape =this.currShape
 
this.clearCanvas();
  this.ctx.strokeStyle=this.borderColor
  this.ctx.fillStyle=this.fillColor
this.ctx.lineWidth=this.lineWidth
this.ctx.setLineDash(this.lineDash)
if(currShape=="rect"){
 this.ctx.fillRect(this.startX,this.startY,Math.abs(width),height)
this.ctx.strokeRect(this.startX,this.startY,Math.abs(width),height)
}
else if(currShape=="circle"){
  const radius =Math.max(width,height)/2 ;
  const centerX = this.startX + radius ;
  const centerY = this.startY +radius ;
this.ctx.beginPath();
this.ctx.arc(centerX,centerY,Math.abs(radius),0,2*Math.PI) ;
this.ctx.fillStyle=this.fillColor;
this.ctx.fill()
this.ctx.strokeStyle=this.borderColor
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
  this.ctx.strokeStyle=this.borderColor
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
  this.ctx.strokeStyle=this.borderColor
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
 this.ctx.strokeStyle=this.borderColor
 this.ctx.fillStyle=this.fillColor;
this.ctx.fill()
  this.ctx.stroke()
}else if(this.currShape=="line"){

this.ctx.beginPath();

// Set a start-point
this.ctx.moveTo(this.startX,this.startY);

// Set an end-point
this.ctx.lineTo(e.clientX,e.clientY);

 this.ctx.strokeStyle=this.borderColor
this.ctx.stroke();
}

}
}
initMouseHandler(){
 this.canvas.addEventListener("mousedown",this.mouseDownHandler
 )

 this.canvas.addEventListener("mouseup",this.mouseUpHandler ) 


  this.canvas.addEventListener("mousemove",this.mouseMoveHandler)

}
//////////////////////////////////////////////////////////////////////////////////    change type of shape
isPointInsideShape(shape:any,x:number,y:number){
if(shape.type=="rect"){
 

           return(
            
            x>=shape.x && y>=shape.y && x<=shape.x+shape.width && y<=shape.y+shape.height
           )
        
}else if(shape.type=="circle"){
         let dx= x-shape.centerX
         let dy=y-shape.centerY
         let rad= Math.sqrt(dx*dx+dy*dy)
       return rad<=shape.radius
}else if(shape.type=="arrow"){

 let x1 = shape.startX
 let y1 = shape.startY
 let x2 = shape.endX
 let y2 = shape.endY

 let numerator =
  (y2 - y1) * x -
  (x2 - x1) * y +
  (x2 * y1) -
  (y2 * x1)

 let denominator = Math.sqrt(
  (y2 - y1) * (y2 - y1) +
  (x2 - x1) * (x2 - x1)
 )
if(denominator === 0){
  return false
 }
 let distance = Math.abs(numerator / denominator)

 const tolerance = 5

 if(
  x >= Math.min(x1,x2) &&
  x <= Math.max(x1,x2) &&
  y >= Math.min(y1,y2) &&
  y <= Math.max(y1,y2) &&
  distance <= tolerance
 ){
  return true
 }

 return false
}else if(shape.type=="pencil"){
  let tolerance=3
   const elemFound=shape.points.find((e:{startX:number,startY:number})=>Math.abs(e.startX-x)<=tolerance && Math.abs(e.startY-y)<=tolerance)
   if(elemFound!==undefined){
    return true;
   }else{
    return false;
   }
}else if(shape.type=="diamond"){
const centerX = (shape.startX + shape.endX) / 2
 const centerY = (shape.startY + shape.endY) / 2

 const halfWidth = Math.abs(shape.endX - shape.startX) / 2
 const halfHeight = Math.abs(shape.endY - shape.startY) / 2

 const dx = Math.abs(x - centerX)
 const dy = Math.abs(y - centerY)
 // denominator can become 0 can cause infinity
if(halfWidth === 0 || halfHeight === 0){
   return false
 }
 return (dx / halfWidth + dy / halfHeight) <= 1

}
}
}
