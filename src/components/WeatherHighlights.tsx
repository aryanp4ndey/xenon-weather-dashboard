import React, { memo } from "react";
import { Wind, Droplets, Eye, Sun, Sunset } from "lucide-react";
import { format } from "date-fns";
import { useWeather } from "@/contexts/WeatherContext";

const WeatherHighlights = memo(() => {
  const { geoData, weatherData, isLoading, isError, city } = useWeather();

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-foreground mb-6 sm:mb-8 text-shadow">Today's Highlight</h3>
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 sm:p-5">
              <div className="h-4 w-20 sm:w-24 bg-foreground/10 rounded mb-3" />
              <div className="h-7 sm:h-8 w-20 bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !geoData) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-foreground mb-6 sm:mb-8 text-shadow">Today's Highlight</h3>
        <p className="text-sm text-red-500">Could not find the city "{city}".</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-foreground mb-6 sm:mb-8 text-shadow">Today's Highlight</h3>
        <p className="text-sm text-red-500">Failed to load weather data.</p>
      </div>
    );
  }

  const w = weatherData;
  const wind = w.wind?.speed ?? 0; // m/s in metric by default for OWM; could convert to km/h
  const windKmh = Math.round(wind * 3.6);
  const humidity = w.main?.humidity ?? 0;
  const visibilityKm = w.visibility != null ? (w.visibility / 1000).toFixed(1) : "-";
  const pressure = w.main?.pressure ?? 0;
  const tz = w.timezone ?? 0; // seconds offset from UTC
  const sunrise = w.sys?.sunrise ? new Date((w.sys.sunrise + tz) * 1000) : null;
  const sunset = w.sys?.sunset ? new Date((w.sys.sunset + tz) * 1000) : null;

  const highlights = [
    {
      title: "Wind Status",
      value: windKmh.toString(),
      unit: "km/h",
      time: "",
      icon: Wind,
      description: windKmh > 20 ? "Strong wind" : windKmh > 10 ? "Moderate wind" : "Light breeze",
      progress: Math.min(windKmh / 50 * 100, 100), // Max 50 km/h for scale
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Humidity",
      value: humidity.toString(),
      unit: "%",
      time: "",
      icon: Droplets,
      description: humidity > 70 ? "High humidity" : humidity < 30 ? "Low humidity" : "Comfortable",
      progress: humidity,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Visibility",
      value: String(visibilityKm),
      unit: "km",
      time: "",
      icon: Eye,
      description: parseFloat(String(visibilityKm)) > 10 ? "Excellent" : parseFloat(String(visibilityKm)) > 5 ? "Good" : "Poor",
      progress: Math.min(parseFloat(String(visibilityKm)) / 20 * 100, 100), // Max 20km for scale
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "Pressure",
      value: pressure.toString(),
      unit: "hPa",
      time: "",
      icon: Sun,
      description: pressure > 1020 ? "High pressure" : pressure < 1000 ? "Low pressure" : "Normal",
      progress: Math.min(Math.max((pressure - 980) / 60 * 100, 0), 100), // Scale 980-1040 hPa
      color: "from-purple-400 to-pink-400"
    }
  ];

  const sunInfo = [
    {
      title: "Sunrise",
      time: sunrise ? format(sunrise, "h:mm a") : "-",
      icon: Sun,
      color: "from-orange-400 to-yellow-400",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-yellow-500/20"
    },
    {
      title: "Sunset",
      time: sunset ? format(sunset, "h:mm a") : "-",
      icon: Sunset,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-600/20 to-red-600/20"
    }
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 h-full shadow-glass card-entrance">
      <h3 className="text-lg sm:text-xl font-medium text-foreground mb-6 sm:mb-8 text-shadow">Today's Highlight</h3>
      
      <div className="space-y-8">
        {/* Weather Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {highlights.map((item, index) => (
            <div key={index} className="glass rounded-2xl p-4 sm:p-5 glass-hover interactive-card">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 rounded-xl bg-foreground/10 backdrop-blur-sm">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">{item.time}</span>
              </div>
              
              <div className="mb-3">
                <span className="text-xl sm:text-2xl font-light text-foreground text-shadow">{item.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground ml-1 font-medium">{item.unit}</span>
              </div>
              
              <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-2 sm:mb-3">{item.title}</p>
              
              {/* Progress Bar */}
              <div className="progress-bar mb-2">
                <div 
                  className={`progress-fill bg-gradient-to-r ${item.color}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              
              {item.description && (
                <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Sun Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {sunInfo.map((item, index) => (
            <div key={index} className="glass rounded-2xl p-4 sm:p-5 glass-hover interactive-card">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-3 rounded-xl ${item.bgColor} backdrop-blur-sm`}>
                  <item.icon className={`h-4 w-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-2">{item.title}</p>
              <p className="text-base sm:text-lg font-medium text-foreground text-shadow">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

WeatherHighlights.displayName = 'WeatherHighlights';

export default WeatherHighlights;