import React from "react";
import { useWeather } from "@/contexts/WeatherContext";

export const TomorrowCard = () => {
  const { forecastData, geoData, isLoading } = useWeather();

  if (isLoading || !forecastData) {
    return (
      <div className="glass-card rounded-[32px] p-6 sm:p-8 h-[250px] animate-pulse">
        <div className="h-4 bg-foreground/10 rounded w-1/4 mb-4"></div>
      </div>
    );
  }

  const list: any[] = forecastData.list ?? [];
  const tzOffsetSec: number = forecastData.city?.timezone ?? 0;
  
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().split('T')[0];

  const tomorrowItems = list.filter(item => {
    const date = new Date((item.dt + tzOffsetSec) * 1000);
    return date.toISOString().split('T')[0] === tomorrowKey;
  });

  const avgTemp = tomorrowItems.length > 0 
    ? Math.round(tomorrowItems.reduce((sum, item) => sum + (item.main?.temp ?? 0), 0) / tomorrowItems.length)
    : 20;

  return (
    <div className="relative rounded-[32px] overflow-hidden h-[250px] shadow-lg group interactive-card">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: "url('/images/rainy.png')", backgroundColor: "#e2f0a5" }}
      ></div>
      
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30 z-0"></div>

      <div className="relative z-10 p-6 flex flex-col h-full justify-between text-gray-800 dark:text-white drop-shadow-sm">
        <div>
           <p className="text-sm font-semibold opacity-80">Tomorrow</p>
           <h3 className="text-xl font-bold mt-1">{geoData?.name || 'City'}</h3>
        </div>
        
        <div>
           <div className="text-5xl font-bold">{avgTemp}°C</div>
           <p className="text-sm font-semibold mt-1">Rainy</p>
        </div>
      </div>
    </div>
  );
};
