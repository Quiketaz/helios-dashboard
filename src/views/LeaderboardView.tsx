import { useMemo } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import { calculateRPGStats } from '../utils/utils';
import { AwardBadge } from '../components/AwardBadge';
//import type { PaxData } from '../types';

export const LeaderboardView = () => {
  const { filteredPax, setSelectedPax } = useData();

  const rankedPax = useMemo(() => {
    return filteredPax
      .map(p => ({
        ...p,
        stats: calculateRPGStats(p)
      }))
      .sort((a, b) => b.stats.impact - a.stats.impact)
      .slice(0, 50); // Display top 50
  }, [filteredPax]);

  return (
    <div className="space-y-8">
      <div className="bg-surface-container border border-outline-variant/20 rounded-[2.5rem] p-6 md:p-8 shadow-inner">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary" size={24} />
            <h2 className="text-xl md:text-2xl font-black italic text-on-surface uppercase tracking-tight">Impact Leaderboard</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Shield size={16} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Leadership Ranking</span>
          </div>
        </div>

        <div className="grid gap-3">
          {rankedPax.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelectedPax(p)}
              className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-high transition-all active:scale-[0.99] group text-left shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-primary font-black italic text-lg w-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <div className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.awards.slice(0, 3).map(a => (
                      <AwardBadge key={a} award={a} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Class</span>
                  <span className="text-xs font-black text-on-surface uppercase">{p.stats.class}</span>
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Impact Score</span>
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-primary" />
                    <span className="text-xl font-black text-primary">{p.stats.impact}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};