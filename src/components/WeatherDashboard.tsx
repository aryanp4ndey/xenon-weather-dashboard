import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { WeatherProvider, useWeather } from "@/contexts/WeatherContext";
import { searchCities, GeoResult, reverseGeocode } from "@/lib/weatherApi";

import { Sidebar } from "./Sidebar";
import WeatherCard from "./WeatherCard";
import { AirQualityCard } from "./AirQualityCard";
import { TomorrowCard } from "./TomorrowCard";
import SunriseCard from "./SunriseCard";
import CountriesWeather from "./CountriesWeather";

const WeatherDashboardContent = memo(() => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { city, setCity, suggestions, setSuggestions } = useWeather() as any; 
  // We'll handle search locally if context doesn't expose it
  const [localSuggestions, setLocalSuggestions] = useState<GeoResult[]>([]);
  const [openSuggest, setOpenSuggest] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          if (res) {
            setCity(`${res.name}, ${res.country}`);
          }
        } catch (error) {
          console.error("Geolocation reverse geocode failed", error);
        }
      });
    }
  }, []);

  const handleSearchCommit = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) setCity(trimmed);
  }, [searchQuery, setCity]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchCommit();
    }
  }, [handleSearchCommit]);

  const handleThemeToggle = useCallback(() => {
    const current = resolvedTheme ?? theme;
    setTheme(current === "dark" ? "light" : "dark");
  }, [resolvedTheme, theme, setTheme]);

  // Compute local time
  const [localTime, setLocalTime] = useState("");
  const { weatherData } = useWeather();
  
  useEffect(() => {
    const updateTime = () => {
      if (!weatherData) return;
      const targetOffsetSec: number = weatherData?.timezone ?? 0;
      const browserOffsetSec: number = -new Date().getTimezoneOffset() * 60;
      const deltaSec = targetOffsetSec - browserOffsetSec;
      const adjustedMs = Date.now() + deltaSec * 1000;
      const targetLocalDate = new Date(adjustedMs);
      setLocalTime(format(targetLocalDate, "EEEE, d MMM yyyy | hh:mm a"));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [weatherData]);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-[#111315] text-gray-800 dark:text-gray-100 font-sans overflow-hidden">
      {/* Sidebar (Left) */}
      <div className="hidden md:block w-24 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content (Center) */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/images/avatar.png" alt="User Avatar" className="w-14 h-14 rounded-2xl object-cover bg-orange-100 dark:bg-gray-800" />
            <div>
              <h1 className="text-xl text-gray-500 font-medium leading-tight">Hello,</h1>
              <h2 className="text-3xl font-bold leading-tight">User</h2>
              {localTime && <p className="text-sm text-gray-400 font-medium mt-1">{localTime}</p>}
            </div>
          </div>
          
          <div className="flex flex-1 max-w-md mx-8 relative">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search anything ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 w-full h-12 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500"
                />
             </div>
          </div>
          
          <button 
            onClick={handleThemeToggle}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          >
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
           <WeatherCard />
           <AirQualityCard />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">How's the temperature today?</h3>
             </div>
             {/* Chart Placeholder */}
             <div className="h-40 flex items-end justify-between px-4 pb-4 border-b border-orange-200 relative">
                {/* SVG Curve placeholder */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                   <path d="M0,80 Q100,20 200,80 T400,60" fill="none" stroke="#f97316" strokeWidth="2" />
                </svg>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xl font-bold mb-8">20°</span>
                   <span className="text-xs text-gray-400">Morning</span>
                </div>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xl font-bold mb-16">34°</span>
                   <span className="text-xs text-gray-400">Afternoon</span>
                </div>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xl font-bold mb-12">28°</span>
                   <span className="text-xs text-gray-400">Evening</span>
                </div>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xl font-bold mb-4">22°</span>
                   <span className="text-xs text-gray-400">Night</span>
                </div>
             </div>
           </div>
           <TomorrowCard />
        </div>
      </div>

      {/* Right Sidebar (Right) */}
      <div className="hidden lg:block w-[350px] bg-white dark:bg-gray-800 p-8 border-l border-gray-100 dark:border-gray-800 overflow-y-auto">
         <SunriseCard />
         <div className="mt-8">
           <h3 className="font-bold text-lg mb-4">Weather Prediction</h3>
           <CountriesWeather />
         </div>
      </div>
    </div>
  );
});

WeatherDashboardContent.displayName = 'WeatherDashboardContent';

const WeatherDashboard = () => {
  const [city, setCity] = useState<string>("Banten");

  return (
    <WeatherProvider city={city} setCity={setCity}>
      <WeatherDashboardContent />
    </WeatherProvider>
  );
};

export default WeatherDashboard;