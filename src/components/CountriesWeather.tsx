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
    <div className="glass-card rounded-3xl p-8 shadow-glass">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-medium text-text-primary">Others Countries</h3>
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary glass-hover rounded-2xl">
          See All
          <MoreHorizontal className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {countries.map((country, index) => (
          <div key={index} className="flex items-center justify-between p-6 glass rounded-2xl glass-hover">
            <div>
              <p className="text-xs text-text-muted mb-2 font-medium">{country.country}</p>
              <p className="text-lg font-medium text-text-primary mb-2">{country.city}</p>
              <p className="text-sm text-text-secondary font-medium">{country.condition}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <country.icon className="h-8 w-8 text-yellow-500" />
              <div className="text-right">
                <span className="text-2xl font-light text-text-primary">{country.temp}</span>
                <span className="text-sm text-text-secondary font-medium">{country.lowTemp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesWeather;