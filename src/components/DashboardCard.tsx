import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard = ({ children, className = '' }: DashboardCardProps) => {
  return (
    // Uses the .card class from App.css which handles background and elevation
    // Adds text-left to override the global text-center from #root
    <div className={`card text-left ${className}`}>
      {children}
    </div>
  );
};