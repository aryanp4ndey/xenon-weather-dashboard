/* Weather condition utilities for emojis, backgrounds, and animations */

export interface WeatherCondition {
  emoji: string;
  background: string;
  description: string;
  animation?: string;
}

export function getWeatherEmoji(weatherCode: string, isDay: boolean = true): string {
  const code = weatherCode.toLowerCase();
  
  // Clear sky
  if (code.includes('clear')) {
    return isDay ? '🌞' : '🌙';
  }
  
  // Clouds
  if (code.includes('few clouds') || code.includes('scattered clouds')) {
    return isDay ? '⛅' : '🌙';
  }
  if (code.includes('broken clouds') || code.includes('overcast')) {
    return '☁️';
  }
  if (code.includes('clouds')) {
    return isDay ? '🌥️' : '☁️';
  }
  
  // Rain
  if (code.includes('shower rain') || code.includes('light rain')) {
    return '🌦️';
  }
  if (code.includes('rain')) {
    return '🌧️';
  }
  
  // Thunderstorm
  if (code.includes('thunderstorm')) {
    return '⛈️';
  }
  
  // Snow
  if (code.includes('snow')) {
    return code.includes('light') ? '🌨️' : '❄️';
  }
  
  // Mist/Fog
  if (code.includes('mist') || code.includes('fog') || code.includes('haze')) {
    return '🌫️';
  }
  
  // Default
  return isDay ? '🌞' : '🌙';
}

export function getWeatherBackground(weatherCode: string, isDay: boolean = true): string {
  const code = weatherCode.toLowerCase();
  
  if (code.includes('clear')) {
    return isDay 
      ? 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #fdcb6e 100%)'
      : 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #74b9ff 100%)';
  }
  
  if (code.includes('clouds')) {
    return isDay
      ? 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 50%, #a78bfa 100%)'
      : 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)';
  }
  
  if (code.includes('rain') || code.includes('thunderstorm')) {
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)';
  }
  
  if (code.includes('snow')) {
    return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)';
  }
  
  if (code.includes('mist') || code.includes('fog')) {
    return 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)';
  }
  
  // Default gradient
  return isDay
    ? 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    : 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)';
}

export function isDayTime(sunrise: number, sunset: number, timezone: number = 0): boolean {
  const now = Math.floor(Date.now() / 1000) + timezone;
  return now >= sunrise && now <= sunset;
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

export function getWeatherAnimation(weatherCode: string): string {
  const code = weatherCode.toLowerCase();
  
  if (code.includes('clear')) return 'sun-rays';
  if (code.includes('clouds')) return 'floating-clouds';
  if (code.includes('rain')) return 'falling-rain';
  if (code.includes('thunderstorm')) return 'lightning';
  if (code.includes('snow')) return 'falling-snow';
  
  return 'gentle-breeze';
}
