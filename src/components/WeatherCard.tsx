import { MapPin, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";

const WeatherCard = () => {
  return (
    <Card className="bg-weather-card-bg border-border shadow-card p-6 h-full">
      <div className="flex items-center text-text-secondary mb-2">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="text-sm">Dhaka, Bangladesh</span>
        <span className="ml-4 text-sm">°C</span>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Sunday</h2>
        <p className="text-text-secondary text-sm">04 Aug,2024</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            {/* Weather Icon - Cloud with rain */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="relative">
                {/* Cloud */}
                <div className="w-24 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full relative">
                  <div className="absolute -top-3 left-4 w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="absolute -top-2 right-6 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                </div>
                {/* Rain drops */}
                <div className="absolute -bottom-2 left-6 flex space-x-1">
                  <div className="w-1 h-6 bg-blue-400 rounded-full opacity-70"></div>
                  <div className="w-1 h-4 bg-blue-400 rounded-full opacity-70"></div>
                  <div className="w-1 h-5 bg-blue-400 rounded-full opacity-70"></div>
                  <div className="w-1 h-3 bg-blue-400 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-6xl font-light text-temperature-primary mb-2">28°</div>
          <div className="text-text-secondary text-lg mb-4">/24°C</div>
          <div>
            <p className="text-lg font-medium text-text-primary mb-1">Heavy Rain</p>
            <p className="text-text-secondary text-sm">feels like 31°</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;