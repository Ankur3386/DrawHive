import React from "react";

const Customize = () => {
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-black",
    "bg-white",
    "bg-slate-500",
  ];

  return (
  
      
      <div className="bg-slate-400 h-123 w-62 rounded-2xl p-6 flex flex-col gap-6 shadow-lg">

        <div>
          <div className="text-black font-semibold  text-sm">Stroke</div>

          <div className="flex gap-3">
            {colors.map((color, id) => (
              <div
                key={id}
                className={`w-7 h-7 ${color} border rounded-md cursor-pointer`}
              ></div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-black font-semibold text-sm">Background</div>

          <div className="flex gap-3">
            {colors.map((color, id) => (
              <div
                key={id}
                className={`w-7 h-7 ${color} border rounded-md cursor-pointer`}
              ></div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-black font-semibold text-sm">Stroke Width</div>

          <div className="flex gap-4 items-center">
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
              <div className="w-4 h-1  bg-black"></div>
              </div>
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 h-2 bg-black"></div>
              </div>
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
                <div className="w-4 h-3 bg-black"></div>
              </div>
          </div>
        </div>

        {/* Stroke Style */}
        <div>
          <div className="text-black font-semibold text-sm">Stroke Style</div>

          <div className="flex gap-6">
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
             <div className="w-4 border-b-2 border-black"></div>
              </div>
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 border-b-2 border-dashed border-black"></div>
              </div>
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 border-b-2 border-dotted border-black"></div>
              </div>
            
          
          
          </div>
        </div>


    </div>
  );
};

export default Customize;