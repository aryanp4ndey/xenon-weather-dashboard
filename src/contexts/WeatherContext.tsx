import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { geocodeCity, fetchCurrentWeather, fetchForecast, fetchAirQuality } from '@/lib/weatherApi';

interface WeatherContextType {
  city: string;
  setCity: (city: string) => void;
  geoData: any;
  weatherData: any;
  forecastData: any;
  airQualityData: any;
  isLoading: boolean;
  isError: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
  city: string;
  setCity: (city: string) => void;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children, city, setCity }) => {
  // Single geocoding query
  const geoQuery = useQuery({
    queryKey: ["geo", city],
    queryFn: () => geocodeCity(city),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const coords = geoQuery.data ? { lat: geoQuery.data.lat, lon: geoQuery.data.lon } : null;

  // Single weather query
  const weatherQuery = useQuery({
    queryKey: ["current", coords?.lat, coords?.lon],
    queryFn: () => fetchCurrentWeather(coords!.lat, coords!.lon, "metric"),
    enabled: !!coords,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Single forecast query
  const forecastQuery = useQuery({
    queryKey: ["forecast", coords?.lat, coords?.lon],
    queryFn: () => fetchForecast(coords!.lat, coords!.lon, "metric"),
    enabled: !!coords,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Air Quality query
  const aqiQuery = useQuery({
    queryKey: ["aqi", coords?.lat, coords?.lon],
    queryFn: () => fetchAirQuality(coords!.lat, coords!.lon),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = geoQuery.isLoading || weatherQuery.isLoading || forecastQuery.isLoading || aqiQuery.isLoading;
  const isError = geoQuery.isError || weatherQuery.isError || forecastQuery.isError || aqiQuery.isError;

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        geoData: geoQuery.data,
        weatherData: weatherQuery.data,
        forecastData: forecastQuery.data,
        airQualityData: aqiQuery.data,
        isLoading,
        isError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
