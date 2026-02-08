import React from 'react';
import { Zap, Users, TrendingUp, MapPin, Trophy } from 'lucide-react';
import type { PaxData } from '../types';
import { StatCard } from '../components/StatCard';

export const DashboardView = ({ paxList, user }: { paxList: PaxData[], user: PaxData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div className="lg:col-span-8 space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Posts" value={paxList.reduce((a, b) => a + b.posts, 0).toLocaleString()} icon={<Zap size={20}/>} />
        <StatCard title="Total PAX" value={paxList.length.toString()} icon={<Users size={20}/>} />
        <StatCard title="Avg Consistency" value={`${Math.round(paxList.reduce((acc, p) => acc + p.consistency, 0) / (paxList.length || 1))}%`} icon={<TrendingUp size={20}/>} />
        <StatCard title="Home AO" value="Helios" icon={<MapPin size={20}/>} />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8">
        <h2 className="text-2xl font-black italic text-white uppercase mb-8">Top Performers</h2>
        <div className="space-y-4">
          {paxList.slice(0, 5).map((p, i) => (
            <div key={p.name} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800">
              <span className="font-bold text-white">#{i+1} {p.name}</span>
              <span className="text-xl font-black text-yellow-400">{p.posts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);