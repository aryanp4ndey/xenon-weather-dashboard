import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Cloud, Thermometer, Wind, Droplets } from "lucide-react";

const MapView = () => {
  const { city, weatherData } = useWeather();
  
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative w-full h-[calc(100vh-200px)] rounded-[32px] overflow-hidden shadow-xl border border-white/20">
      {/* Google Maps Iframe */}
      <iframe
        title="Google Maps"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        className="grayscale-[0.2] dark:invert-[0.9] dark:hue-rotate-180"
      />

      {/* Floating Weather Overlay */}
      {weatherData && (
        <div className="absolute top-6 left-6 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 min-w-[240px] animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Weather</h3>
              <p className="text-xl font-bold">{city}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <Cloud className="text-orange-500 w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Temp</p>
                <p className="text-sm font-bold">{Math.round(weatherData.main.temp)}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Wind</p>
                <p className="text-sm font-bold">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Humidity</p>
                <p className="text-sm font-bold">{weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Clouds</p>
                <p className="text-sm font-bold">{weatherData.clouds.all}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 italic capitalize">
              {weatherData.weather[0].description}
            </p>
          </div>
        </div>
      )}

      {/* Map Legend/Status */}
      <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/10">
        Live Map View • {city}
      </div>
    </div>
  );
};

export default MapView;
