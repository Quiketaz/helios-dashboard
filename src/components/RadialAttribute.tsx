import React from 'react';

interface RadialAttributeProps {
  label: string;
  value: number;
  max?: number;
  icon: React.ElementType;
}

export const RadialAttribute: React.FC<RadialAttributeProps> = ({ 
  label, 
  value, 
  max = 100, 
  icon: Icon 
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(255,215,0,0.1)]" viewBox="0 0 128 128">
          {/* Background Track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-surface-container-highest"
          />
          {/* Progress Fill */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset }}
            strokeLinecap="round"
            className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <Icon className="text-on-surface-variant mb-0.5 md:mb-1" size={20} />
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl md:text-2xl font-black text-on-surface leading-none">{value}</span>
            <span className="text-[8px] md:text-[10px] font-bold text-on-surface-variant/40 uppercase">/ {max}</span>
          </div>
        </div>
      </div>
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
    </div>
  );
};