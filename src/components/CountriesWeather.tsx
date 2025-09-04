import { MoreHorizontal, Sun, CloudSun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CountriesWeather = () => {
  const countries = [
    {
      country: "Australia",
      city: "Canberra",
      condition: "Sunny",
      temp: "32°",
      lowTemp: "/24°",
      icon: Sun
    },
    {
      country: "Japan",
      city: "Tokyo",
      condition: "Mostly Sunny",
      temp: "30°",
      lowTemp: "/16°",
      icon: CloudSun
    }
  ];

  return (
    <Card className="bg-weather-card-bg border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Others Countries</h3>
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
          See All
          <MoreHorizontal className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {countries.map((country, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-weather-card-secondary rounded-lg">
            <div>
              <p className="text-xs text-text-muted mb-1">{country.country}</p>
              <p className="text-lg font-semibold text-text-primary mb-1">{country.city}</p>
              <p className="text-sm text-text-secondary">{country.condition}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <country.icon className="h-8 w-8 text-yellow-500" />
              <div className="text-right">
                <span className="text-2xl font-semibold text-text-primary">{country.temp}</span>
                <span className="text-sm text-text-secondary">{country.lowTemp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CountriesWeather;