import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { geocodeCity, fetchForecast } from "@/lib/weatherApi";
import { getWeatherEmoji, isDayTime } from "@/lib/weatherUtils";

interface WeatherForecastProps {
  city: string;
}

const WeatherForecast = ({ city }: WeatherForecastProps) => {
  const geoQuery = useQuery({
    queryKey: ["geo", city],
    queryFn: () => geocodeCity(city),
  });

  const coords = geoQuery.data ? { lat: geoQuery.data.lat, lon: geoQuery.data.lon } : null;

  const forecastQuery = useQuery({
    queryKey: ["forecast", coords?.lat, coords?.lon],
    queryFn: () => fetchForecast(coords!.lat, coords!.lon, "metric"),
    enabled: !!coords,
  });

  const dailyForecast = useMemo(() => {
    if (!forecastQuery.data) return [];

    const list: any[] = forecastQuery.data.list ?? [];
    const tzOffsetSec: number = forecastQuery.data.city?.timezone ?? 0;

    // Group forecast items by day
    const forecastsByDay: { [key: string]: any[] } = list.reduce((acc, item) => {
      const date = new Date((item.dt + tzOffsetSec) * 1000);
      const dayKey = format(date, "yyyy-MM-dd");
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(item);
      return acc;
    }, {});

    const now = new Date();
    const todayKey = format(now, "yyyy-MM-dd");
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowKey = format(tomorrow, "yyyy-MM-dd");

    // Process each day's data for the next 5 days
    return Object.keys(forecastsByDay)
      .slice(0, 5)
      .map(dayKey => {
        const dayItems = forecastsByDay[dayKey];
        if (!dayItems || dayItems.length === 0) return null;

        const avgTemp = Math.round(
          dayItems.reduce((sum, item) => sum + (item.main?.temp ?? 0), 0) / dayItems.length
        );

        const middayItem = dayItems.find(item => {
          const date = new Date((item.dt + tzOffsetSec) * 1000);
          const hour = date.getUTCHours();
          return hour >= 12 && hour < 15;
        }) || dayItems[Math.floor(dayItems.length / 2)];

        const condition = middayItem.weather?.[0]?.description ?? "";
        const emoji = getWeatherEmoji(condition, true);
        const date = new Date((dayItems[0].dt + tzOffsetSec) * 1000);

        let displayDay = format(date, "eeee");
        if (dayKey === todayKey) displayDay = "Today";
        else if (dayKey === tomorrowKey) displayDay = "Tomorrow";

        return {
          day: displayDay,
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          temp: avgTemp,
          emoji: emoji,
        };
      })
      .filter(Boolean) as { day: string; condition: string; temp: number; emoji: string }[];
  }, [forecastQuery.data]);

  if (geoQuery.isLoading || forecastQuery.isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-4 sm:mb-6 text-shadow">Today / Week</h3>
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 sm:h-5 w-20 sm:w-24 bg-foreground/10 rounded" />
              <div className="h-7 sm:h-8 w-14 sm:w-16 bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (geoQuery.isError || !coords) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Today / Week</h3>
        <p className="text-sm text-red-400">Could not find the city "{city}".</p>
      </div>
    );
  }

  if (forecastQuery.isError) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass card-entrance">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 text-shadow">Today / Week</h3>
        <p className="text-sm text-red-400">Failed to load forecast.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass card-entrance">
      <h3 className="text-lg sm:text-xl font-medium text-white mb-4 sm:mb-6 text-shadow">Today / Week</h3>
      <div className="space-y-2">
        {dailyForecast.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between glass rounded-2xl p-3 sm:p-4 glass-hover interactive-card"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div>
              <p className="text-xs sm:text-sm text-white/80 font-medium">{item.day}</p>
              <p className="text-[11px] sm:text-xs text-white/60 font-medium">{item.condition}</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-xl sm:text-2xl gentle-breeze">{item.emoji}</div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-light text-white text-shadow">{item.temp}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;