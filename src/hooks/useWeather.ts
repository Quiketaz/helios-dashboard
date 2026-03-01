import { useState, useEffect } from 'react';
import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WeatherState {
  temperature: number | null;
  conditionText: string;
  Icon: LucideIcon;
  loading: boolean;
  error: string | null;
}

const weatherMap: Record<number, { text: string; Icon: LucideIcon }> = {
  0: { text: 'Clear Sky', Icon: Sun },
  1: { text: 'Mainly Clear', Icon: CloudSun },
  2: { text: 'Partly Cloudy', Icon: CloudSun },
  3: { text: 'Overcast', Icon: Cloud },
  45: { text: 'Fog', Icon: Cloud },
  48: { text: 'Fog', Icon: Cloud },
  51: { text: 'Light Drizzle', Icon: CloudDrizzle },
  53: { text: 'Moderate Drizzle', Icon: CloudDrizzle },
  55: { text: 'Dense Drizzle', Icon: CloudDrizzle },
  61: { text: 'Slight Rain', Icon: CloudRain },
  63: { text: 'Moderate Rain', Icon: CloudRain },
  65: { text: 'Heavy Rain', Icon: CloudRain },
  71: { text: 'Slight Snow', Icon: CloudSnow },
  73: { text: 'Moderate Snow', Icon: CloudSnow },
  75: { text: 'Heavy Snow', Icon: CloudSnow },
  80: { text: 'Slight Rain Showers', Icon: CloudRain },
  81: { text: 'Moderate Rain Showers', Icon: CloudRain },
  82: { text: 'Violent Rain Showers', Icon: CloudRain },
  95: { text: 'Thunderstorm', Icon: CloudLightning },
  96: { text: 'Thunderstorm with Hail', Icon: CloudLightning },
  99: { text: 'Thunderstorm with Heavy Hail', Icon: CloudLightning },
};

export const useWeather = (): WeatherState => {
  const [state, setState] = useState<WeatherState>({
    temperature: null,
    conditionText: 'Loading...',
    Icon: Sun,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=29.7858&longitude=-95.8245&current_weather=true&temperature_unit=fahrenheit'
        );
        
        if (!response.ok) throw new Error('Weather service unavailable');
        
        const data = await response.json();
        const current = data.current_weather;
        const mapping = weatherMap[current.weathercode] || { text: 'Unknown', Icon: Sun };

        setState({
          temperature: Math.round(current.temperature),
          conditionText: mapping.text,
          Icon: mapping.Icon,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch weather',
        }));
      }
    };

    fetchWeather();
  }, []);

  return state;
};
