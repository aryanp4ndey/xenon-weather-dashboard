import React from "react";
import { useWeather } from "@/contexts/WeatherContext";

export const AirQualityCard = () => {
  const { weatherData, isLoading, isError } = useWeather();

  const getAqiDetails = (aqi: number | undefined) => {
    if (!aqi) return { text: "Unknown", color: "bg-gray-500", label: "No Data" };
    if (aqi === 1) return { text: "Good", color: "bg-green-500", label: "Good" };
    if (aqi === 2) return { text: "Fair", color: "bg-yellow-500", label: "Fair" };
    if (aqi === 3) return { text: "Moderate", color: "bg-orange-500", label: "Standard" };
    if (aqi === 4) return { text: "Poor", color: "bg-red-500", label: "Poor" };
    return { text: "Very Poor", color: "bg-purple-500", label: "Hazardous" };
  };

  if (isLoading || isError) {
    return (
      <div className="glass-card rounded-[32px] p-6 h-[250px] animate-pulse">
        <div className="h-4 bg-foreground/10 rounded w-1/4 mb-4"></div>
      </div>
    );
  }

  // Use a mock AQI value since it might not be directly available in the basic weatherData depending on the API.
  // The original highlights used weatherData.main.grnd_level or similar as mock.
  const aqiValue = 390; // Mocking to match the image: 390 AQI
  const windDir = weatherData?.wind?.deg || 0;
  
  // Calculate wind direction string
  const getWindDirection = (deg: number) => {
    if (deg > 337.5 || deg <= 22.5) return 'North Wind';
    if (deg > 22.5 && deg <= 67.5) return 'NE Wind';
    if (deg > 67.5 && deg <= 112.5) return 'East Wind';
    if (deg > 112.5 && deg <= 157.5) return 'SE Wind';
    if (deg > 157.5 && deg <= 202.5) return 'South Wind';
    if (deg > 202.5 && deg <= 247.5) return 'SW Wind';
    if (deg > 247.5 && deg <= 292.5) return 'West Wind';
    if (deg > 292.5 && deg <= 337.5) return 'NW Wind';
    return 'Wind';
  };

  return (
    <div className="relative rounded-[32px] overflow-hidden h-[250px] shadow-lg group interactive-card">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: "url('/images/air_quality.png')" }}
      ></div>
      
      {/* Dark overlay for dark mode readability */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white drop-shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">Air Quality</h3>
            <p className="text-xs text-white/80 font-medium">Main pollutant : PM 2.5</p>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-bold">{aqiValue}</span>
            <span className="bg-lime-400 text-lime-900 text-xs font-bold px-2 py-0.5 rounded-md">AQI</span>
          </div>
          <p className="text-sm text-white/90 font-medium">{getWindDirection(windDir)}</p>
        </div>

        {/* Custom Progress Bar matching the design */}
        <div className="bg-white dark:bg-[#1c2128] backdrop-blur-md rounded-2xl px-6 py-4 flex items-center mt-2 shadow-lg relative">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mr-4 z-10">Good</span>
          
          <div className="flex-1 relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-2 flex items-center">
            <div className="absolute left-0 h-full bg-orange-500 rounded-full w-1/3 z-0"></div>
            <div className="absolute left-1/3 -translate-x-1/2 bg-[#1a1f26] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10">
              Standard
            </div>
          </div>
          
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 ml-4 z-10">Hazardous</span>
        </div>
      </div>
    </div>
  );
};
