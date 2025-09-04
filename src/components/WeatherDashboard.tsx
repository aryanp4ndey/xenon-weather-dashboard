import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherCard from "./WeatherCard";
import WeatherHighlights from "./WeatherHighlights";
import CountriesWeather from "./CountriesWeather";
import WeatherForecast from "./WeatherForecast";
import { geocodeCity, fetchCurrentWeather } from "@/lib/weatherApi";

const WeatherDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState<string>("Lucknow");

  const handleSearchCommit = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) setCity(trimmed);
  };

  // Fetch timezone for the searched city to show its local date/time
  const geoQuery = useQuery({
    queryKey: ["geo", city],
    queryFn: () => geocodeCity(city),
  });

  const coords = geoQuery.data ? { lat: geoQuery.data.lat, lon: geoQuery.data.lon } : null;

  const weatherQuery = useQuery({
    queryKey: ["current", coords?.lat, coords?.lon],
    queryFn: () => fetchCurrentWeather(coords!.lat, coords!.lon, "metric"),
    enabled: !!coords,
    // refresh roughly every minute so time stays current
    refetchInterval: 60000,
  });

  let localDateTimeText = "";
  if (geoQuery.isLoading || weatherQuery.isLoading) {
    localDateTimeText = "Loading local time...";
  } else if (geoQuery.isError || weatherQuery.isError || !weatherQuery.data) {
    localDateTimeText = ""; // hide on error
  } else {
    const targetOffsetSec: number = weatherQuery.data?.timezone ?? 0; // target offset from UTC in seconds
    const browserOffsetSec: number = -new Date().getTimezoneOffset() * 60; // local offset from UTC in seconds
    const deltaSec = targetOffsetSec - browserOffsetSec; // adjust current time by offset difference
    const adjustedMs = Date.now() + deltaSec * 1000;
    const targetLocalDate = new Date(adjustedMs);
    localDateTimeText = format(targetLocalDate, "eeee, MMM d • hh:mm a");
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-700 ease-out overflow-x-hidden">
      <div className="w-full">
        {/* Main Content */}
        <div className="w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12 card-entrance" style={{ animationDelay: '0.05s' }}>
            <div className="transition-all duration-500 ease-out">
              <p className="text-3xl sm:text-5xl font-light text-white transition-all duration-300 break-words">{city}</p>
              {localDateTimeText && (
                <p className="text-white/70 text-sm sm:text-base mt-2 transition-opacity duration-300">{localDateTimeText}</p>
              )}
            </div>
            
            <div className="flex w-full sm:w-auto items-center sm:space-x-6 gap-3">
              {/* Search */}
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 transition-all duration-300 group-focus-within:text-white/80" />
                <Input
                  placeholder="Search your location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchCommit();
                  }}
                  className="pl-12 w-full sm:w-80 h-12 sm:h-14 glass-card border-0 placeholder:text-white/50 text-white rounded-3xl font-medium text-base transition-all duration-300 focus:scale-[1.02] sm:focus:scale-105 focus:shadow-2xl"
                />
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-12 w-12 sm:h-14 sm:w-14 glass-hover rounded-3xl text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
              >
                {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
              
              {/* User Avatar */}
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-3xl bg-white/10 flex items-center justify-center shadow-glass transition-all duration-300 hover:scale-110 hover:bg-white/20 cursor-pointer">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Weather Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Main Weather Card */}
            <div className="xl:col-span-2 card-entrance transition-all duration-500" style={{ animationDelay: '0.1s' }}>
              <WeatherCard city={city} />
            </div>
            
            {/* Today's Highlights */}
            <div className="card-entrance transition-all duration-500" style={{ animationDelay: '0.15s' }}>
              <WeatherHighlights city={city} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Forecast */}
            <div className="xl:col-span-2">
              <div className="card-entrance transition-all duration-500" style={{ animationDelay: '0.2s' }}>
                <WeatherForecast city={city} />
              </div>
            </div>

            {/* Right: Other Cities */}
            <div className="card-entrance transition-all duration-500" style={{ animationDelay: '0.3s' }}>
              <CountriesWeather />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;