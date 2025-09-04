/* OpenWeatherMap API utilities */

export type GeoResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type CurrentWeather = any; // Keep flexible for now
export type ForecastResponse = any; // Keep flexible for now

const API_BASE = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;

function ensureApiKey() {
  if (!API_KEY) {
    throw new Error("Missing VITE_OPENWEATHER_API_KEY. Add it to your .env file.");
  }
}

export async function geocodeCity(city: string): Promise<GeoResult | null> {
  ensureApiKey();
  
  // Try different variations of the city name
  const variations = [
    city,
    city + ",IN", // Add India country code for Indian cities
    city + ",US", // Add US country code for US cities
    city.replace(/\s+/g, ""), // Remove spaces
  ];

  for (const variation of variations) {
    try {
      const url = `${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(variation)}&limit=5&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      
      const data: GeoResult[] = await res.json();
      if (data && data.length > 0) {
        return data[0]; // Return the first match
      }
    } catch (error) {
      console.warn(`Geocoding failed for "${variation}":`, error);
      continue;
    }
  }
  
  return null;
}

export async function fetchCurrentWeather(lat: number, lon: number, units: "metric" | "imperial" = "metric"): Promise<CurrentWeather> {
  ensureApiKey();
  const url = `${API_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Current weather failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchForecast(lat: number, lon: number, units: "metric" | "imperial" = "metric"): Promise<ForecastResponse> {
  ensureApiKey();
  const url = `${API_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast failed: ${res.status} ${res.statusText}`);
  return res.json();
}
