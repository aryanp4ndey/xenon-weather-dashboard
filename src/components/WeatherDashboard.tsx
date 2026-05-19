import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search, Sun, Moon, MapPin } from "lucide-react";
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
import MapView from "./MapView";

const WeatherDashboardContent = memo(() => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { city, setCity, suggestions, setSuggestions } = useWeather() as any; 
  const [activeTab, setActiveTab] = useState(0);

  const [localSuggestions, setLocalSuggestions] = useState<GeoResult[]>([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        const results = await searchCities(searchQuery);
        setLocalSuggestions(results);
        setOpenSuggest(results.length > 0);
      } else {
        setLocalSuggestions([]);
        setOpenSuggest(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchCommit = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setCity(trimmed);
      setOpenSuggest(false);
      setSearchQuery("");
    }
  }, [searchQuery, setCity]);

  const handleSuggestionClick = (suggestion: GeoResult) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setSearchQuery("");
    setOpenSuggest(false);
  };

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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content (Center) */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/images/User.jpg" alt="User Avatar" className="w-14 h-14 rounded-full object-cover bg-orange-100 dark:bg-gray-800" />
            <div>
              <h1 className="text-xl text-gray-500 font-medium leading-tight">Hello,</h1>
              <h2 className="text-3xl font-bold leading-tight">User</h2>
              {localTime && <p className="text-sm text-gray-400 font-medium mt-1">{localTime}</p>}
            </div>
          </div>
          
          <div className="flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search anything ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length > 2 && setOpenSuggest(true)}
                  className="pl-12 w-full h-12 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500"
                />
             </div>

             {openSuggest && localSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                 {localSuggestions.map((suggestion, idx) => (
                   <div
                     key={`${suggestion.lat}-${suggestion.lon}-${idx}`}
                     onClick={() => handleSuggestionClick(suggestion)}
                     className="px-6 py-4 hover:bg-orange-50 dark:hover:bg-orange-500/10 cursor-pointer flex items-center justify-between transition-colors border-b last:border-none border-gray-50 dark:border-gray-700"
                   >
                     <div className="flex items-center gap-3">
                       <MapPin className="h-4 w-4 text-orange-500" />
                       <div>
                         <span className="font-bold">{suggestion.name}</span>
                         {suggestion.state && <span className="text-xs text-gray-400 ml-2">{suggestion.state}</span>}
                       </div>
                     </div>
                     <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">{suggestion.country}</span>
                   </div>
                 ))}
               </div>
             )}
          </div>
          
          <button 
            onClick={handleThemeToggle}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-orange-500"
          >
            {resolvedTheme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {activeTab === 0 ? (
          <>
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
          </>
        ) : activeTab === 1 ? (
          <MapView />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] text-gray-400 italic">
            Component for this tab is under development...
          </div>
        )}
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
  const [city, setCity] = useState<string>("Delhi, India");

  return (
    <WeatherProvider city={city} setCity={setCity}>
      <WeatherDashboardContent />
    </WeatherProvider>
  );
};

export default WeatherDashboard;