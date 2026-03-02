import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { Maximize2, Minimize2 } from 'lucide-react';

interface WeatherCardProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ isExpanded, onToggle }) => {
  const { temperature, conditionText, Icon, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="h-10 w-24 bg-surface-container-highest rounded-full animate-pulse border border-outline-variant/10" />
    );
  }

  // Gracefully hide if there's an error or no data
  if (error || temperature === null) return null;

  if (!isExpanded) {
    return (
      <button 
        onClick={() => onToggle(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant/20 text-on-surface hover:bg-primary/10 transition-all group"
      >
        <Icon size={16} className="text-primary group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold">{temperature}°</span>
        <Maximize2 size={12} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-20 bg-surface-container-high p-6 flex flex-col justify-center items-center border border-outline-variant/20 transition-all duration-300">
      <button 
        onClick={() => onToggle(false)}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
      >
        <Minimize2 size={20} />
      </button>
      <div className="text-primary mb-3">
        <Icon size={48} strokeWidth={2.5} />
      </div>
      <div className="text-5xl font-black text-on-surface tracking-tighter">
        {temperature}°
      </div>
      <div className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-1">
        {conditionText}
      </div>
      <div className="text-[10px] text-on-surface-variant/40 font-medium uppercase mt-6">
        Katy, TX
      </div>
    </div>
  );
};