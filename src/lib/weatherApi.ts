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

// Cache for geocoding results to avoid repeated API calls
const geocodeCache = new Map<string, GeoResult | null>();

export async function geocodeCity(city: string): Promise<GeoResult | null> {
  ensureApiKey();
  
  // Check cache first
  const cacheKey = city.toLowerCase().trim();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }
  
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
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!res.ok) continue;
      
      const data: GeoResult[] = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        geocodeCache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn(`Geocoding failed for "${variation}":`, error);
      continue;
    }
  }
  
  geocodeCache.set(cacheKey, null);
  return null;
}

// Search for multiple matching cities for autocomplete suggestions
export async function searchCities(query: string, limit = 5): Promise<GeoResult[]> {
  ensureApiKey();
  const q = query.trim();
  if (!q) return [];

  const url = `${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${API_KEY}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data: GeoResult[] = await res.json();

  // Deduplicate by name+state+country combination
  const seen = new Set<string>();
  const unique: GeoResult[] = [];
  for (const item of data) {
    const key = `${item.name}|${item.state ?? ''}|${item.country}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }
  return unique;
}

export async function fetchCurrentWeather(lat: number, lon: number, units: "metric" | "imperial" = "metric"): Promise<CurrentWeather> {
  ensureApiKey();
  const url = `${API_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Current weather failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchForecast(lat: number, lon: number, units: "metric" | "imperial" = "metric"): Promise<ForecastResponse> {
  ensureApiKey();
  const url = `${API_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Forecast failed: ${res.status} ${res.statusText}`);
  return res.json();
}
