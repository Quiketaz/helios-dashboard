import React from 'react';

export const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl">
    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{title}</p>
    <div className="flex items-center gap-2">
      <span className="text-teal-500">{icon}</span>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
  </div>
);
