import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { geocodeCity, fetchCurrentWeather } from "@/lib/weatherApi";
import { getWeatherEmoji, getWeatherBackground, isDayTime, getTimeBasedGreeting, getWeatherAnimation } from "@/lib/weatherUtils";

interface WeatherCardProps {
  city: string;
}

const WeatherCard = ({ city }: WeatherCardProps) => {
  const geoQuery = useQuery({
    queryKey: ["geo", city],
    queryFn: () => geocodeCity(city),
  });

  const coords = geoQuery.data ? { lat: geoQuery.data.lat, lon: geoQuery.data.lon } : null;

  const weatherQuery = useQuery({
    queryKey: ["current", coords?.lat, coords?.lon],
    queryFn: () => fetchCurrentWeather(coords!.lat, coords!.lon, "metric"),
    enabled: !!coords,
  });

  const today = useMemo(() => new Date(), []);

  if (geoQuery.isLoading || weatherQuery.isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 sm:w-40 bg-white/10 rounded" />
          <div className="h-8 w-48 sm:w-64 bg-white/10 rounded" />
          <div className="h-24 sm:h-32 w-full bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (geoQuery.isError || !coords) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <p className="text-sm text-red-400">Could not find the city "{city}".</p>
      </div>
    );
  }

  if (weatherQuery.isError) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <p className="text-sm text-red-400">Failed to load weather data.</p>
      </div>
    );
  }

  const w = weatherQuery.data;
  const temp = Math.round(w.main?.temp ?? 0);
  const tempMin = Math.round(w.main?.temp_min ?? 0);
  const tempMax = Math.round(w.main?.temp_max ?? 0);
  const desc = w.weather?.[0]?.description ?? "";
  const weatherCode = w.weather?.[0]?.main ?? "";
  const locationLabel = `${geoQuery.data?.name || city}${geoQuery.data?.country ? ", " + geoQuery.data.country : ""}`;
  
  const isDay = isDayTime(w.sys?.sunrise ?? 0, w.sys?.sunset ?? 0, w.timezone ?? 0);
  const weatherEmoji = getWeatherEmoji(desc, isDay);
  const weatherBg = getWeatherBackground(desc, isDay);
  const animationClass = getWeatherAnimation(desc);
  const greeting = getTimeBasedGreeting();

  return (
    <div 
      className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance interactive-card relative overflow-hidden"
      style={{ background: weatherBg }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className={`w-full h-full ${animationClass}`} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center text-white/80 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium text-shadow">{locationLabel}</span>
          <span className="ml-4 text-sm font-medium">°C</span>
        </div>
        
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-2 text-shadow">{format(today, "EEEE")}</h2>
          <p className="text-white/70 text-xs sm:text-sm font-medium">{format(today, "dd MMM, yyyy")}</p>
          <p className="text-white/60 text-[11px] sm:text-xs font-medium mt-1">{greeting}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              <div className={`weather-emoji ${animationClass}`}>
                {weatherEmoji}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-6xl sm:text-7xl font-extralight text-white mb-2 sm:mb-3 text-shadow">
              {temp}°
            </div>
            <div className="text-white/70 text-lg sm:text-xl font-light mb-4 sm:mb-6">
              {tempMin}° / {tempMax}°C
            </div>
            <div>
              <p className="text-lg sm:text-xl font-medium text-white mb-1 sm:mb-2 text-shadow">
                {desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : ""}
              </p>
              <p className="text-white/60 text-xs sm:text-sm font-medium">
                feels like {Math.round(w.main?.feels_like ?? temp)}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;