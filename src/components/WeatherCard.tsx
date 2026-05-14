import React, { useMemo, memo } from "react";
import { Cloud, Wind, Droplets, Eye } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";

const WeatherCard = memo(() => {
  const { weatherData, isLoading, isError } = useWeather();

  if (isLoading || isError || !weatherData) {
    return (
      <div className="glass-card rounded-[32px] p-6 sm:p-8 h-[250px] animate-pulse">
        <div className="h-4 bg-foreground/10 rounded w-1/4 mb-4"></div>
      </div>
    );
  }

  const w = weatherData;
  const temp = Math.round(w.main?.temp ?? 0);
  const tempMin = Math.round(w.main?.temp_min ?? 0);
  const desc = w.weather?.[0]?.description ?? "Clear";
  const mainCondition = w.weather?.[0]?.main?.toLowerCase() || 'clear';
  
  const pressure = w.main?.pressure ?? 0;
  const humidity = w.main?.humidity ?? 0;
  const visibility = (w.visibility ?? 0) / 1000;

  // Determine if it is day or night
  const isDay = () => {
    if (!w.sys?.sunrise || !w.sys?.sunset) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    // Adjusted current time for the location
    const targetOffsetSec: number = w.timezone ?? 0;
    const browserOffsetSec: number = -new Date().getTimezoneOffset() * 60;
    const deltaSec = targetOffsetSec - browserOffsetSec;
    const localNow = nowSec + deltaSec;
    const localSunrise = w.sys.sunrise + deltaSec;
    const localSunset = w.sys.sunset + deltaSec;
    return localNow >= localSunrise && localNow < localSunset;
  };

  const dayTime = isDay();

  // Determine background image based on weather condition
  let bgImage = "url('/images/sunny.png')";
  if (!dayTime) {
    bgImage = "url('/images/night.png')";
  } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle') || mainCondition.includes('thunderstorm')) {
    bgImage = "url('/images/rainy.png')";
  } else if (mainCondition.includes('cloud') && w.clouds?.all > 50) {
    bgImage = "url('/images/cloudy.png')";
  }

  return (
    <div className="relative rounded-[32px] overflow-hidden h-[250px] shadow-lg group interactive-card">
      {/* Background Image - scaled up slightly to hide any generated borders */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-110 scale-105"
        style={{ backgroundImage: bgImage }}
      ></div>
      
      {/* Dark overlay for text readability in dark mode */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-between drop-shadow-md">
        
        {/* Top section */}
        <div className="flex items-center gap-2">
           <div className="bg-white/20 p-2 rounded-full backdrop-blur-md text-white">
            <Cloud size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight text-white">Weather</h3>
            <p className="text-xs text-white/80 font-medium">What's the weather.</p>
          </div>
        </div>

        {/* Middle section: Temperature */}
        <div className="mt-auto mb-4 text-white">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-bold">{temp}°C</span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">{tempMin}°C</span>
          </div>
          <p className="text-sm font-medium mt-1 capitalize">{desc}</p>
        </div>

        {/* Bottom section: Metrics Pills */}
        <div className="flex gap-2 sm:gap-3 mt-2 overflow-hidden w-full">
          <div className="bg-[#1c2128]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl flex flex-col shadow-lg flex-1 min-w-0">
             <span className="text-[10px] text-gray-400 font-medium">Pressure</span>
             <span className="font-bold text-sm truncate">{pressure}mb</span>
          </div>
          <div className="bg-[#a3e635]/90 backdrop-blur-md text-lime-950 px-5 py-3 rounded-2xl flex flex-col shadow-lg flex-1 min-w-0">
             <span className="text-[10px] font-medium opacity-80">Visibility</span>
             <span className="font-bold text-sm truncate">{visibility.toFixed(1)} km</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md text-gray-800 px-5 py-3 rounded-2xl flex flex-col shadow-lg flex-1 min-w-0">
             <span className="text-[10px] text-gray-500 font-medium">Humidity</span>
             <span className="font-bold text-sm truncate">{humidity}%</span>
          </div>
        </div>

      </div>
    </div>
  );
});

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;