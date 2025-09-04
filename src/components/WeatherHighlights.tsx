import { Wind, Droplets, Eye, Sun, Sunset } from "lucide-react";
import { Card } from "@/components/ui/card";

const WeatherHighlights = () => {
  const highlights = [
    {
      title: "Wind Status",
      value: "7.90",
      unit: "km/h",
      time: "9:00 AM",
      icon: Wind,
      description: "Humidity is good"
    },
    {
      title: "Humidity",
      value: "85",
      unit: "%",
      time: "",
      icon: Droplets,
      description: "Humidity is good"
    },
    {
      title: "UV Index",
      value: "4",
      unit: "UV",
      time: "9:00 AM",
      icon: Sun,
      description: "Moderate UV"
    },
    {
      title: "Visibility",
      value: "5",
      unit: "km",
      time: "9:00 AM",
      icon: Eye,
      description: ""
    }
  ];

  const sunInfo = [
    {
      title: "Sunrise",
      time: "4:50 AM",
      icon: Sun,
      color: "sunrise-color"
    },
    {
      title: "Sunset",
      time: "6:45 PM",
      icon: Sunset,
      color: "sunset-color"
    }
  ];

  return (
    <Card className="bg-weather-card-bg border-border shadow-card p-6 h-full">
      <h3 className="text-xl font-semibold text-text-primary mb-6">Today's Highlight</h3>
      
      <div className="space-y-6">
        {/* Weather Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {highlights.map((item, index) => (
            <div key={index} className="bg-weather-card-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <item.icon className="h-5 w-5 text-weather-accent" />
                <span className="text-xs text-text-muted">{item.time}</span>
              </div>
              <div className="mb-2">
                <span className="text-2xl font-semibold text-text-primary">{item.value}</span>
                <span className="text-sm text-text-secondary ml-1">{item.unit}</span>
              </div>
              <p className="text-xs font-medium text-text-secondary mb-1">{item.title}</p>
              {item.description && (
                <p className="text-xs text-text-muted">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Sun Info */}
        <div className="grid grid-cols-2 gap-4">
          {sunInfo.map((item, index) => (
            <div key={index} className="bg-weather-card-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-full bg-${item.color}/20`}>
                  <item.icon className={`h-4 w-4 text-${item.color}`} />
                </div>
              </div>
              <p className="text-xs font-medium text-text-secondary mb-1">{item.title}</p>
              <p className="text-lg font-semibold text-text-primary">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherHighlights;