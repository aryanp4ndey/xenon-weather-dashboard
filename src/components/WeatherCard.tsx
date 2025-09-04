import { MapPin, CloudRain } from "lucide-react";
import { Card } from "@/components/ui/card";

const WeatherCard = () => {
  return (
    <div className="glass-card rounded-3xl p-8 h-full shadow-glass">
      <div className="flex items-center text-text-secondary mb-4">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Dhaka, Bangladesh</span>
        <span className="ml-4 text-sm font-medium">°C</span>
      </div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-light text-text-primary mb-2">Sunday</h2>
        <p className="text-text-secondary text-sm font-medium">04 Aug, 2024</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            {/* Weather Icon - Cloud with rain */}
            <div className="w-36 h-36 flex items-center justify-center">
              <div className="relative">
                {/* Cloud */}
                <div className="w-28 h-20 bg-gradient-to-br from-gray-300/80 to-gray-400/80 rounded-full relative backdrop-blur-sm">
                  <div className="absolute -top-4 left-5 w-14 h-14 bg-gradient-to-br from-gray-200/80 to-gray-300/80 rounded-full backdrop-blur-sm"></div>
                  <div className="absolute -top-3 right-7 w-10 h-10 bg-gradient-to-br from-gray-200/80 to-gray-300/80 rounded-full backdrop-blur-sm"></div>
                </div>
                {/* Rain drops */}
                <div className="absolute -bottom-3 left-7 flex space-x-1">
                  <div className="w-1 h-8 bg-blue-400/70 rounded-full backdrop-blur-sm"></div>
                  <div className="w-1 h-6 bg-blue-400/70 rounded-full backdrop-blur-sm"></div>
                  <div className="w-1 h-7 bg-blue-400/70 rounded-full backdrop-blur-sm"></div>
                  <div className="w-1 h-5 bg-blue-400/70 rounded-full backdrop-blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-7xl font-extralight text-text-primary mb-3">28°</div>
          <div className="text-text-secondary text-xl font-light mb-6">/24°C</div>
          <div>
            <p className="text-xl font-medium text-text-primary mb-2">Heavy Rain</p>
            <p className="text-text-secondary text-sm font-medium">feels like 31°</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;