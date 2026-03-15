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
    <div className="absolute top-16 left-2 sm:left-4 md:left-6 lg:left-8 bg-[#1E1F23] 
                    sm:h-[450px] md:h-[500px] lg:h-[550px] w-[220px] sm:w-[240px] md:w-[260px] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 md:gap-6 shadow-lg z-10">

      {/* Stroke Colors */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Stroke</div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {colors.map((color, id) => (
            <div
              key={id}
              className={`w-6 h-6 sm:w-8 sm:h-7 ${color} border rounded-md cursor-pointer`}
            ></div>
          ))}
        </div>
      </div>

      {/* Background Colors */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Background</div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {colors.map((color, id) => (
            <div
              key={id}
              className={`w-6 h-6 sm:w-7 sm:h-7 ${color} border rounded-md cursor-pointer`}
            ></div>
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
              className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300"
            >
              <div
                className={`w-3 sm:w-4 h-${size} bg-white rounded-xl`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stroke Style */}
      <div>
        <div className="text-gray-500 font-semibold text-sm sm:text-sm">Stroke Style</div>
        <div className="flex gap-4 sm:gap-6">
          <div className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 bg-black rounded-xl"></div>
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 border-dashed bg-black rounded-xl"></div>
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 border rounded-md cursor-pointer flex items-center justify-center hover:bg-purple-300">
            <div className="w-3 sm:w-4 border-b-2 border-dotted bg-black rounded-xl"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Customize;