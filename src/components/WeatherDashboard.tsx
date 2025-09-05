import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherProvider, useWeather } from "@/contexts/WeatherContext";
import { searchCities, GeoResult } from "@/lib/weatherApi";

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
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSearchCommit = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) setCity(trimmed);
  }, [searchQuery, setCity]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenSuggest(true);
      setHighlightIndex((prev) => Math.min(prev + 1, Math.max(0, suggestions.length - 1)));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      if (openSuggest && highlightIndex >= 0 && highlightIndex < suggestions.length) {
        const sel = suggestions[highlightIndex];
        const label = `${sel.name}${sel.state ? ", " + sel.state : ""}, ${sel.country}`;
        setSearchQuery(label);
        setCity(label);
        setOpenSuggest(false);
        setHighlightIndex(-1);
      } else {
        handleSearchCommit();
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpenSuggest(false);
      setHighlightIndex(-1);
      return;
    }
  }, [suggestions, openSuggest, highlightIndex, handleSearchCommit, setCity]);

  const handleSelectSuggestion = useCallback((sel: GeoResult) => {
    const label = `${sel.name}${sel.state ? ", " + sel.state : ""}, ${sel.country}`;
    setSearchQuery(label);
    setCity(label);
    setOpenSuggest(false);
    setHighlightIndex(-1);
  }, [setCity]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions([]);
      setOpenSuggest(false);
      setHighlightIndex(-1);
      return;
    }
    let alive = true;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const results = await searchCities(q, 7);
        if (!alive) return;
        setSuggestions(results);
        setOpenSuggest(results.length > 0);
        setHighlightIndex(results.length ? 0 : -1);
      } catch {
        /* ignore */
      }
    }, 200);
    return () => {
      alive = false;
      ctrl.abort();
      clearTimeout(t);
    };
  }, [searchQuery]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchContainerRef.current) return;
      if (!searchContainerRef.current.contains(e.target as Node)) {
        setOpenSuggest(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

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
              <div className="relative group flex-1" ref={searchContainerRef}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5 transition-all duration-300 group-focus-within:text-white/80" />
                <Input
                  placeholder="Search your location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (suggestions.length) setOpenSuggest(true); }}
                  className="pl-12 w-full sm:w-80 h-12 sm:h-14 glass-card border-0 placeholder:text-white/50 text-white rounded-3xl font-medium text-base transition-all duration-300 focus:scale-[1.02] sm:focus:scale-105 focus:shadow-2xl"
                />
                {openSuggest && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-2xl glass-card backdrop-blur border border-white/10 shadow-2xl">
                    <ul role="listbox" aria-label="City suggestions" className="py-2">
                      {suggestions.map((s, idx) => {
                        const label = `${s.name}${s.state ? ", " + s.state : ""}, ${s.country}`;
                        const active = idx === highlightIndex;
                        return (
                          <li
                            key={`${s.name}-${s.state ?? ''}-${s.country}-${idx}`}
                            role="option"
                            aria-selected={active}
                            onMouseEnter={() => setHighlightIndex(idx)}
                            onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}
                            className={`px-4 py-2 cursor-pointer text-sm text-white/90 flex items-center justify-between ${active ? 'bg-white/10' : 'hover:bg-white/10'}`}
                          >
                            <span>{label}</span>
                            <span className="text-xs text-white/50">{s.lat.toFixed(2)}, {s.lon.toFixed(2)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
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
                <WeatherHighlights />
              </React.Suspense>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Forecast */}
            <div className="xl:col-span-2">
              <div className="transition-all duration-300">
                <React.Suspense fallback={<LoadingCard />}>
                  <WeatherForecast />
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