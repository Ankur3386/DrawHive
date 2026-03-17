import React, { useState } from "react";

const Customize = ({setBorderColor,setfillColor,setLineDash,setWidth}:{setBorderColor:(color:string)=>void,setfillColor:(color:string)=>void,setLineDash:(dash:{x:number,y:number})=>void,setWidth:(size:number)=>void}) => {
  const colors = [
    { bg:"bg-orange-500", text:"#f97316"},
    { bg:"bg-blue-500", text:"#4299e1"},
    { bg:"bg-green-700", text:"#388E3C"},
    { bg:"bg-white", text:"white"},
    { bg:"bg-black", text:"black"},
    { bg:"bg-slate-600", text:"#45556c"},
  ];
const [selectedStroke, setSelectedStroke] = useState<number>();
const [selectedBackground, setSelectedBackground] = useState<number>();
  return (
    <div className="absolute top-16 left-2 sm:left-4 md:left-6 lg:left-8 bg-[#1E1F23] 
                    sm:h-[450px] md:h-[500px] lg:h-[550px] w-[210px] sm:w-[230px] md:w-[250px] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 md:gap-6 shadow-lg z-10">

      {/* Stroke Colors */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Stroke</div>
        <div className="flex gap-2  sm:gap-3 flex-wrap">
          {colors.map((color, id) => (
            <div key={id}              
             className={`p-0.5 hover:bg-purple-400 border  ${selectedStroke===id ? "border-purple-700":"border-black"} border-2    rounded-md `}>

           
            <div
              
                onClick={()=>{
                   setBorderColor(`${color.text}`)
                   setSelectedStroke(id)
              }
               
              }
              className={`w-5 h-5 sm:w-6 sm:h-6 ${color.bg} border  rounded-md cursor-pointer`}
            ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Colors */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Background</div>
        <div className="flex gap-2 sm:gap-3 flex-wrap ">
          {colors.map((color, id) => (
            <div key={id} 
               
              className={`p-1 hover:bg-slate-600 border ${selectedBackground===id ? "bg-slate-600":""} border-black rounded-md `}>

           
            <div
               onClick={()=>{
                   setfillColor(`${color.text}`)
                   setSelectedBackground(id)
              }}
               
              className={`w-5 h-5 sm:w-6 sm:h-6 ${color.bg}  border  rounded-md cursor-pointer`}
            ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Stroke Width</div>
        <div className="flex gap-3 sm:gap-4 items-center">
          {[1, 2, 3].map((size, idx) => (
            <div
              key={idx}
              onClick={()=>{
                setWidth(size)
              
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300"
            >
              <div
                className={`w-3 sm:w-4 ${size==1?"h-1":size==2?"h-2":"h-3"} bg-white rounded-xl`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stroke Style */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Stroke Style</div>
        <div className="flex gap-4 sm:gap-6">
          <div  onClick={()=>{
              setLineDash({x:0,y:0})
            }}  className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 bg-black rounded-xl"></div>
          </div>
          <div onClick={()=>{
              setLineDash({x:8,y:2})
             
            }} className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 border-dashed bg-black rounded-xl"></div>
          </div>
          <div  onClick={()=>{
              setLineDash({x:2,y:2})
            }} className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 border-dotted bg-black rounded-xl"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Customize;