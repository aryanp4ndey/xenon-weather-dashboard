import React, { useState, useCallback, memo } from "react";
import { format } from "date-fns";
import { Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherProvider, useWeather } from "@/contexts/WeatherContext";

// Lazy load components for better performance with preloading
const WeatherCard = React.lazy(() => 
  import("./WeatherCard").then(module => {
    // Preload related components
    import("./WeatherHighlights");
    import("./WeatherForecast");
    return module;
  })
);
const WeatherHighlights = React.lazy(() => import("./WeatherHighlights"));
const CountriesWeather = React.lazy(() => import("./CountriesWeather"));
const WeatherForecast = React.lazy(() => import("./WeatherForecast"));

// Optimized loading component
const LoadingCard = memo(({ className = "" }: { className?: string }) => (
  <div className={`glass-card rounded-3xl p-6 sm:p-8 h-64 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-white/10 rounded w-1/4"></div>
      <div className="h-8 bg-white/10 rounded w-1/2"></div>
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
    </div>
  </div>
));

LoadingCard.displayName = 'LoadingCard';

const WeatherDashboardContent = memo(() => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { city, setCity, weatherData, geoData, isLoading, isError } = useWeather();

  const handleSearchCommit = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) setCity(trimmed);
  }, [searchQuery, setCity]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearchCommit();
  }, [handleSearchCommit]);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  let localDateTimeText = "";
  if (isLoading) {
    localDateTimeText = "Loading local time...";
  } else if (isError || !weatherData) {
    localDateTimeText = "";
  } else {
    const targetOffsetSec: number = weatherData?.timezone ?? 0;
    const browserOffsetSec: number = -new Date().getTimezoneOffset() * 60;
    const deltaSec = targetOffsetSec - browserOffsetSec;
    const adjustedMs = Date.now() + deltaSec * 1000;
    const targetLocalDate = new Date(adjustedMs);
    localDateTimeText = format(targetLocalDate, "eeee, MMM d • hh:mm a");
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 ease-out overflow-x-hidden">
      <div className="w-full">
        {/* Main Content */}
        <div className="w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="transition-all duration-300 ease-out">
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
                  onKeyDown={handleKeyDown}
                  className="pl-12 w-full sm:w-80 h-12 sm:h-14 glass-card border-0 placeholder:text-white/50 text-white rounded-3xl font-medium text-base transition-all duration-300 focus:scale-[1.02] sm:focus:scale-105 focus:shadow-2xl"
                />
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
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
            <div className="xl:col-span-2 transition-all duration-300">
              <React.Suspense fallback={<LoadingCard />}>
                <WeatherCard />
              </React.Suspense>
            </div>
            
            {/* Today's Highlights */}
            <div className="transition-all duration-300">
              <React.Suspense fallback={<LoadingCard />}>
                <WeatherHighlights city={""} />
              </React.Suspense>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Forecast */}
            <div className="xl:col-span-2">
              <div className="transition-all duration-300">
                <React.Suspense fallback={<LoadingCard />}>
                  <WeatherForecast city={""} />
                </React.Suspense>
              </div>
            </div>

            {/* Right: Other Cities */}
            <div className="transition-all duration-300">
              <React.Suspense fallback={<LoadingCard />}>
                <CountriesWeather />
              </React.Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WeatherDashboardContent.displayName = 'WeatherDashboardContent';

const WeatherDashboard = () => {
  const [city, setCity] = useState<string>("Lucknow");

  return (
    <WeatherProvider city={city} setCity={setCity}>
      <WeatherDashboardContent />
    </WeatherProvider>
  );
};

export default WeatherDashboard;