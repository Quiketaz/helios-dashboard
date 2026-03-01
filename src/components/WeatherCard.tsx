import React from 'react';
import { useWeather } from '../hooks/useWeather';

export const WeatherCard: React.FC = () => {
  const { temperature, conditionText, Icon, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="rounded-3xl bg-surface-container-high p-6 shadow-sm animate-pulse flex flex-col justify-center items-center border border-outline-variant/10">
        <div className="w-10 h-10 bg-primary/20 rounded-full mb-4" />
        <div className="h-8 w-16 bg-on-surface/10 rounded-lg mb-2" />
        <div className="h-3 w-24 bg-on-surface/10 rounded-lg" />
      </div>
    );
  }

  // Gracefully hide if there's an error or no data
  if (error || temperature === null) return null;

  return (
    <div className="rounded-3xl bg-surface-container-high p-6 shadow-sm flex flex-col justify-center items-center border border-outline-variant/20 transition-all hover:bg-surface-container-highest group">
      <div className="text-primary mb-3 transition-transform group-hover:scale-110 duration-300">
        <Icon size={40} strokeWidth={2.5} />
      </div>
      <div className="text-4xl font-black text-on-surface tracking-tighter">
        {temperature}°
      </div>
      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-1">
        {conditionText}
      </div>
      <div className="text-[9px] text-on-surface-variant/40 font-medium uppercase mt-4">
        Katy, TX
      </div>
    </div>
  );
};