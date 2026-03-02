import React from 'react';
import { DashboardCard } from './DashboardCard';

export const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <DashboardCard className="p-5 shadow-xl">
    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span className="text-2xl font-black text-on-surface">{value}</span>
    </div>
  </DashboardCard>
);
