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
    <div className="glass-card rounded-3xl p-8 h-full shadow-glass">
      <h3 className="text-xl font-medium text-text-primary mb-8">Today's Highlight</h3>
      
      <div className="space-y-8">
        {/* Weather Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {highlights.map((item, index) => (
            <div key={index} className="glass rounded-2xl p-5 glass-hover">
              <div className="flex items-center justify-between mb-4">
                <item.icon className="h-5 w-5 text-weather-accent" />
                <span className="text-xs text-text-muted font-medium">{item.time}</span>
              </div>
              <div className="mb-3">
                <span className="text-2xl font-light text-text-primary">{item.value}</span>
                <span className="text-sm text-text-secondary ml-1 font-medium">{item.unit}</span>
              </div>
              <p className="text-xs font-medium text-text-secondary mb-2">{item.title}</p>
              {item.description && (
                <p className="text-xs text-text-muted font-medium">{item.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Sun Info */}
        <div className="grid grid-cols-2 gap-6">
          {sunInfo.map((item, index) => (
            <div key={index} className="glass rounded-2xl p-5 glass-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${item.color}/20 backdrop-blur-sm glass`}>
                  <item.icon className={`h-4 w-4 text-${item.color}`} />
                </div>
              </div>
              <p className="text-xs font-medium text-text-secondary mb-2">{item.title}</p>
              <p className="text-lg font-medium text-text-primary">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherHighlights;