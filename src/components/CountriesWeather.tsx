import React from "react";
import { Cloud, Sun, CloudRain, CalendarDays } from "lucide-react";

const CountriesWeather = () => {
  // Static prediction list to match design
  const predictions = [
    { date: "November 10", condition: "Cloudy", temp: "26° / 19°", icon: <Cloud className="text-gray-400 dark:text-gray-300 w-8 h-8" /> },
    { date: "November 11", condition: "Bright", temp: "26° / 20°", icon: <Sun className="text-orange-400 w-8 h-8 fill-orange-400" /> },
    { date: "November 12", condition: "Rainy", temp: "24° / 18°", icon: <CloudRain className="text-blue-500 w-8 h-8" /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {predictions.map((p, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 dark:bg-[#1a1f26] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">{p.icon}</div>
              <div>
                 <p className="text-[11px] text-gray-400 font-medium">{p.date}</p>
                 <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{p.condition}</p>
              </div>
           </div>
           <div className="font-semibold text-gray-600 dark:text-gray-300 text-sm">
              {p.temp}
           </div>
        </div>
      ))}
      
      <button className="mt-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-4 rounded-[20px] font-bold shadow-[0_8px_16px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3">
         <CalendarDays className="w-5 h-5 opacity-90" />
         Next 5 Days
      </button>
    </div>
  );
};

export default CountriesWeather;