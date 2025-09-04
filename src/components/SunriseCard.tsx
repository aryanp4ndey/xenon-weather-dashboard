import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { geocodeCity, fetchCurrentWeather } from "@/lib/weatherApi";
import { Sun, Sunset } from "lucide-react";

interface SunriseCardProps {
  city: string;
}

const SunriseCard = ({ city }: SunriseCardProps) => {
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

  if (geoQuery.isLoading || weatherQuery.isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Sunrise & Sunset</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="h-4 w-20 bg-foreground/10 rounded mb-3" />
            <div className="h-7 sm:h-8 w-24 bg-foreground/10 rounded" />
          </div>
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="h-4 w-20 bg-foreground/10 rounded mb-3" />
            <div className="h-7 sm:h-8 w-24 bg-foreground/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (geoQuery.isError || !coords) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Sunrise & Sunset</h3>
        <p className="text-sm text-red-400">Could not find the city "{city}".</p>
      </div>
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Sunrise & Sunset</h3>
        <p className="text-sm text-red-400">Failed to load data.</p>
      </div>
    );
  }

  const w = weatherQuery.data;
  const tz = w.timezone ?? 0;
  const sunrise = w.sys?.sunrise ? new Date((w.sys.sunrise + tz) * 1000) : null;
  const sunset = w.sys?.sunset ? new Date((w.sys.sunset + tz) * 1000) : null;

  let length = "-";
  if (sunrise && sunset) {
    const diffMs = sunset.getTime() - sunrise.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    length = `${hours}h ${minutes}m`;
  }

  const tiles = [
    {
      title: "Sunrise",
      time: sunrise ? format(sunrise, "h:mm a") : "-",
      icon: Sun,
      bg: "bg-gradient-to-br from-orange-500/20 to-yellow-500/20",
      iconGrad: "from-orange-400 to-yellow-400",
    },
    {
      title: "Sunset",
      time: sunset ? format(sunset, "h:mm a") : "-",
      icon: Sunset,
      bg: "bg-gradient-to-br from-orange-600/20 to-red-600/20",
      iconGrad: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass">
      <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Sunrise & Sunset</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {tiles.map((t, i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-5 glass-hover interactive-card">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-3 rounded-xl ${t.bg} backdrop-blur-sm`}>
                <t.icon className={`h-4 w-4 bg-gradient-to-r ${t.iconGrad} bg-clip-text text-transparent`} />
              </div>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-white/80 mb-2">{t.title}</p>
            <p className="text-base sm:text-lg font-medium text-white text-shadow">{t.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 glass rounded-2xl p-4 sm:p-5">
        <p className="text-[11px] sm:text-xs font-medium text-white/80 mb-1">Length of day</p>
        <p className="text-base sm:text-lg font-medium text-white text-shadow">{length}</p>
      </div>
    </div>
  );
};

export default SunriseCard;
