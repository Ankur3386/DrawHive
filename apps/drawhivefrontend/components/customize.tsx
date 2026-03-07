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

      
      <div className=" absolute top-16 left-4 bg-[#1E1F23] h-[500px] w-[260px] rounded-2xl p-6 flex flex-col gap-6 shadow-lg z-10">

        <div>
          <div className="text-white font-semibold  text-sm">Stroke</div>

          <div className="flex gap-3 border ">
            {colors.map((color, id) => (
              <div
                key={id}
                className={`w-8 h-7 ${color} border rounded-md cursor-pointer`}
              ></div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white font-semibold text-sm">Background</div>

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
          <div className="text-white font-semibold text-sm">Stroke Width</div>

          <div className="flex gap-4 items-center">
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
              <div className="w-4 h-1  bg-black rounded-xl"></div>
              </div>
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 h-2 bg-black rounded-xl"></div>
              </div>
             <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
                <div className="w-4 h-3 bg-black rounded-xl"></div>
              </div>
          </div>
        </div>

    
        <div>
          <div className="text-white font-semibold text-sm">Stroke Style</div>

          <div className="flex gap-6">
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
             <div className="w-4 border-b-2 bg-black rounded-xl"></div>
              </div>
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 border-b-2 border-dashed bg-black rounded-xl"></div>
              </div>
            <div
                className={`w-7 h-7  border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300`} >
               <div className="w-4 border-b-2 border-dotted bg-black rounded-xl"></div>
              </div>
            
          
          
          </div>
        </div>

      
    </div>
  );
};

export default Customize;