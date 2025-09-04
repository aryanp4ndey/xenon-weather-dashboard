import { useState } from "react";
import { Search, User, Settings, Calendar, Bell, Grid3X3, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherCard from "./WeatherCard";
import WeatherHighlights from "./WeatherHighlights";
import CountriesWeather from "./CountriesWeather";
import WeatherForecast from "./WeatherForecast";

const WeatherDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { icon: Menu, active: false },
    { icon: Grid3X3, active: true },
    { icon: Calendar, active: false },
    { icon: Bell, active: false },
    { icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 glass-card border-r border-border/30 flex flex-col items-center py-6 space-y-4">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`h-10 w-10 glass-hover rounded-2xl ${
                item.active 
                  ? 'bg-weather-accent text-white hover:bg-weather-accent/90 shadow-glass' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-medium text-text-primary mb-2">Hi, Kajal</h1>
              <p className="text-4xl font-light text-text-primary">Good Morning</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <Input
                  placeholder="Search your location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 w-72 h-12 glass-card border-0 placeholder:text-text-muted text-text-primary rounded-2xl font-medium"
                />
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-12 w-12 glass-hover rounded-2xl text-text-secondary hover:text-text-primary"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* User Avatar */}
              <div className="h-12 w-12 rounded-2xl bg-weather-accent flex items-center justify-center shadow-glass">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Weather Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <WeatherCard />
            </div>
            
            {/* Today's Highlights */}
            <div>
              <WeatherHighlights />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <CountriesWeather />
            <WeatherForecast />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;