import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { geocodeCity, fetchCurrentWeather } from "@/lib/weatherApi";
import { getWeatherEmoji, isDayTime } from "@/lib/weatherUtils";
import { useState, useEffect } from "react";

// Extended list of cities for rotation
const ALL_CITIES: { label: string; query: string }[] = [
  { label: "New York", query: "New York,US" },
  { label: "Dubai", query: "Dubai,AE" },
  { label: "Shanghai", query: "Shanghai,CN" },
  { label: "Madrid", query: "Madrid,ES" },
  { label: "Tokyo", query: "Tokyo,JP" },
  { label: "London", query: "London,GB" },
  { label: "Paris", query: "Paris,FR" },
  { label: "Sydney", query: "Sydney,AU" },
  { label: "Mumbai", query: "Mumbai,IN" },
  { label: "São Paulo", query: "São Paulo,BR" },
  { label: "Cairo", query: "Cairo,EG" },
  { label: "Moscow", query: "Moscow,RU" },
];

const CountriesWeather = () => {
  const [currentCitySet, setCurrentCitySet] = useState(0);
  
  // Rotate cities every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCitySet(prev => (prev + 1) % (ALL_CITIES.length / 4));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current 4 cities to display
  const startIndex = currentCitySet * 4;
  const currentCities = ALL_CITIES.slice(startIndex, startIndex + 4);

  const weatherQueries = currentCities.map(({ label, query }) => {
    const geoQuery = useQuery({
      queryKey: ["geo", query],
      queryFn: () => geocodeCity(query),
    });

    const coords = geoQuery.data ? { lat: geoQuery.data.lat, lon: geoQuery.data.lon } : null;

    const weatherQuery = useQuery({
      queryKey: ["current", coords?.lat, coords?.lon],
      queryFn: () => fetchCurrentWeather(coords!.lat, coords!.lon, "metric"),
      enabled: !!coords,
    });

    return { label, geoQuery, weatherQuery };
  });

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass card-entrance overflow-hidden">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-white text-shadow">Other Cities</h3>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white glass-hover rounded-2xl">
          Show All
          <MoreHorizontal className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full overflow-hidden">
        {weatherQueries.map(({ label, geoQuery, weatherQuery }, index) => {
          if (geoQuery.isLoading || weatherQuery.isLoading) {
            return (
              <div key={label} className="relative p-4 sm:p-5 glass rounded-2xl animate-pulse">
                <div className="h-4 w-20 bg-white/10 rounded mb-2" />
                <div className="h-5 sm:h-6 w-24 sm:w-28 bg-white/10 rounded mb-3" />
                <div className="flex items-center justify-end">
                  <div className="h-7 sm:h-8 w-10 sm:w-12 bg-white/10 rounded" />
                </div>
              </div>
            );
          }

          if (geoQuery.isError || weatherQuery.isError || !weatherQuery.data) {
            return (
              <div key={label} className="relative p-4 sm:p-5 glass rounded-2xl glass-hover">
                <span className="absolute left-4 top-3 text-[10px] tracking-wide text-white/60 font-semibold">
                  {geoQuery.data?.country || "--"}
                </span>
                <div className="pt-3">
                  <p className="text-base sm:text-lg font-medium text-white mb-2">{label}</p>
                  <p className="text-xs sm:text-sm text-red-400 font-medium">No data</p>
                </div>
              </div>
            );
          }

          const w = weatherQuery.data;
          const temp = Math.round(w.main?.temp ?? 0);
          const tempMin = Math.round(w.main?.temp_min ?? 0);
          const tempMax = Math.round(w.main?.temp_max ?? temp);
          const country = geoQuery.data?.country || "--";

          return (
            <div
              key={label}
              className="relative p-4 sm:p-5 glass rounded-2xl glass-hover interactive-card overflow-hidden flex flex-col justify-between min-h-[110px] sm:min-h-[120px] min-w-0"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Country code */}
              <span className="absolute left-4 top-3 text-[10px] tracking-wide text-white/60 font-semibold">
                {country}
              </span>

              <div className="pt-3 min-w-0">
                <p className="text-lg sm:text-xl font-light text-white mb-1 text-shadow truncate">{label}</p>
                <p className="text-[11px] sm:text-xs text-white/60 font-medium">H{tempMax}° L{tempMin}°</p>
              </div>

              {/* Temperature in bottom right */}
              <div className="flex justify-end">
                <span className="text-2xl sm:text-3xl font-light text-white text-shadow">{temp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountriesWeather;