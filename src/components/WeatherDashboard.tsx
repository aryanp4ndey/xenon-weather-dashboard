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
    <div className="min-h-screen bg-dashboard-bg">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-sidebar-bg border-r border-border flex flex-col items-center py-6 space-y-6">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${
                item.active 
                  ? 'bg-weather-accent text-white hover:bg-weather-accent/90' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-weather-card-secondary'
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-1">Hi, Kajal</h1>
              <p className="text-3xl font-bold text-text-primary">Good Morning</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <Input
                  placeholder="Search your location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-weather-card-bg border-border"
                />
              </div>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 text-text-secondary hover:text-text-primary hover:bg-weather-card-secondary"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* User Avatar */}
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Weather Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <CountriesWeather />
            <WeatherForecast />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;