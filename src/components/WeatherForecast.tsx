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
    <Card className="bg-weather-card-bg border-border shadow-card p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-6">10 Day Forecast</h3>
      
      <div className="grid grid-cols-5 gap-3">
        {forecast.map((day, index) => (
          <div key={index} className="text-center">
            <p className="text-sm text-text-secondary mb-3">{day.day}</p>
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-weather-card-secondary rounded-lg flex items-center justify-center">
                <day.icon className={`h-6 w-6 ${day.iconColor}`} />
              </div>
            </div>
            <p className="text-sm font-semibold text-text-primary">{day.temp}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeatherForecast;