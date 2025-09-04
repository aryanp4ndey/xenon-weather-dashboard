import { CloudRain, Sun, CloudSun, CloudLightning } from "lucide-react";
import { Card } from "@/components/ui/card";

const WeatherForecast = () => {
  const forecast = [
    {
      day: "Today",
      temp: "28°C",
      icon: CloudRain,
      iconColor: "text-blue-500"
    },
    {
      day: "Mon",
      temp: "31°C", 
      icon: Sun,
      iconColor: "text-yellow-500"
    },
    {
      day: "Tue",
      temp: "27°C",
      icon: CloudRain,
      iconColor: "text-blue-500"
    },
    {
      day: "Wed",
      temp: "29°C",
      icon: CloudLightning,
      iconColor: "text-yellow-600"
    },
    {
      day: "Thu",
      temp: "32°C",
      icon: CloudSun,
      iconColor: "text-yellow-500"
    }
  ];

  return (
    <div className="glass-card rounded-3xl p-8 shadow-glass">
      <h3 className="text-xl font-medium text-text-primary mb-8">10 Day Forecast</h3>
      
      <div className="grid grid-cols-5 gap-6">
        {forecast.map((day, index) => (
          <div key={index} className="text-center glass-hover">
            <p className="text-sm text-text-secondary mb-4 font-medium">{day.day}</p>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center glass-hover">
                <day.icon className={`h-6 w-6 ${day.iconColor}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-text-primary">{day.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;