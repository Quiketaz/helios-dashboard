import React, { useState } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  if (hasError) {
    return (
      <div className={`${sizeMap[size]} bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black italic shadow-lg ${className}`}>
        H
      </div>
    );
  }

  return (
    <div className={`relative flex-shrink-0 ${sizeMap[size]} ${className}`}>
      <img
        src="/logo.png"
        alt="F3 Helios Logo"
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
};