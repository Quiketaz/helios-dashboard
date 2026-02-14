import { useMemo } from 'react';
import { Zap, Users, Trophy, TrendingUp, MapPin } from 'lucide-react';
import type { PaxData, QRecord } from '../types';
import { StatCard } from '../components/StatCard';
import { AwardBadge } from '../components/AwardBadge';

export const DashboardView = ({ paxList, onPaxClick }: { paxList: PaxData[], qList: QRecord[], onPaxClick: (pax: PaxData) => void }) => {
  const stats = useMemo(() => {
    const totalPosts = paxList.reduce((a, b) => a + b.posts, 0);
    const avgConsistency = Math.round(paxList.reduce((acc, p) => acc + p.consistency, 0) / (paxList.length || 1));
    return { totalPosts, avgConsistency };
  }, [paxList]);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Posts" value={stats.totalPosts.toLocaleString()} icon={<Zap size={20}/>} />
        <StatCard title="Total Pax" value={paxList.length.toString()} icon={<Users size={20}/>} />
        <StatCard title="Shield Lock %" value={`${stats.avgConsistency}%`} icon={<TrendingUp size={20}/>} />
        <StatCard title="Home AO" value="Helios" icon={<MapPin size={20}/>} />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-inner">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-yellow-400" size={24} />
          <h2 className="text-2xl font-black italic text-white uppercase">High Impact Men</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {paxList.slice(0, 20).map((p, i) => (
            <button
              key={p.name}
              onClick={() => onPaxClick(p)}
              className="w-full flex flex-col p-3 md:p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 hover:border-yellow-400/50 hover:bg-zinc-900/50 transition-all active:scale-[0.98] group text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-700 font-black italic text-base md:text-lg w-5 md:w-6">{(i + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <div className="text-sm md:text-base font-bold text-white group-hover:text-yellow-400 transition-colors">{p.name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{p.posts >= 100 ? 'Legend' : p.posts >= 50 ? 'Commander' : 'Warrior'}</div>
                  </div>
                </div>
                <span className="text-lg md:text-xl font-black text-yellow-400">{p.posts}</span>
              </div>
              
              <div className="flex gap-2 mt-auto pt-2 border-t border-zinc-800/50">
                {p.awards.length > 0 ? p.awards.map(a => (
                  <AwardBadge key={a} award={a} />
                )) : <span className="text-[10px] text-zinc-700 font-bold uppercase italic">No Awards</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};