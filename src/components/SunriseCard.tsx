import React from "react";
import { Sun } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";

const SunriseCard = () => {
  const { city, geoData } = useWeather();
  const locationName = geoData ? `${geoData.name}, ${geoData.country}` : city;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
         <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Sun</h3>
            <p className="text-sm text-gray-500">{locationName}</p>
         </div>
         <div className="text-2xl font-bold text-orange-500">22°C</div>
      </div>
      
      {/* Sun Arc */}
      <div className="relative h-36 mb-2 flex flex-col items-center justify-end w-full px-4 mt-8">
         {/* The Arc Container */}
         <div className="w-full max-w-[220px] h-[110px] rounded-t-full border-t-[2px] border-l-[2px] border-r-[2px] border-dashed border-orange-300/60 relative overflow-hidden flex items-end">
            {/* Gradient Fill inside the arc */}
            <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-300/40 dark:to-gray-500/30"></div>
         </div>
         
         {/* Base line */}
         <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700"></div>
         
         {/* Sun Icon Positioned on Arc (approximate right side) */}
         <div className="absolute top-4 right-14">
            <Sun className="w-5 h-5 text-orange-400 fill-orange-400 drop-shadow-md" />
         </div>
      </div>
      
      <div className="flex justify-between text-xs font-semibold text-gray-500 mb-8">
         <div className="flex flex-col items-start">
            <span>Sunset</span>
            <span>06:00 am</span>
         </div>
         <div className="flex flex-col items-end">
            <span>Sunrise</span>
            <span>06:45 am</span>
         </div>
      </div>

      {/* UVI Card */}
      <div className="bg-[#2A3547] text-white rounded-[24px] p-5 flex items-center gap-4">
         <div className="bg-orange-400 p-2 rounded-full">☀️</div>
         <div>
            <div className="flex items-center gap-2">
               <span className="text-xl font-bold">20 UVI</span>
               <span className="bg-lime-400 text-lime-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Moderate</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Moderate risk of from UV rays</p>
         </div>
      </div>
    </div>
  );
};

export default SunriseCard;
