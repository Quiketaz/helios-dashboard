import { useMemo, useState } from 'react';
import { Trophy, Medal, Crown, Zap, TrendingUp, Calendar } from 'lucide-react';
import { AwardBadge } from './AwardBadge';
import { DashboardCard } from './DashboardCard';
import { calculateRPGStats } from '../utils/f3Logic';
import { parseDate } from '../utils/dateUtils';
import type { PaxData } from '../types';

interface HallOfFameProps {
  paxList: PaxData[];
  onPaxClick: (pax: PaxData) => void;
}

type SortMode = 'posts' | 'consistency' | 'fng';

export const HallOfFame = ({ paxList, onPaxClick }: HallOfFameProps) => {
  const [sortMode, setSortMode] = useState<SortMode>('posts');

  const sortedPax = useMemo(() => {
    let sorted = [...paxList];
    
    if (sortMode === 'consistency') {
      sorted.sort((a, b) => b.consistency - a.consistency);
    } else if (sortMode === 'fng') {
      // Sort by First BD descending (Newest first)
      sorted.sort((a, b) => {
        if (a.firstBD === 'N/A') return 1;
        if (b.firstBD === 'N/A') return -1;
        try {
          return parseDate(b.firstBD).getTime() - parseDate(a.firstBD).getTime();
        } catch {
          return 0;
        }
      });
    } else {
      // Default: Posts
      sorted.sort((a, b) => b.posts - a.posts);
    }
    
    return sorted.slice(0, 20);
  }, [paxList, sortMode]);

  return (
    <DashboardCard className="border border-outline-variant/20 shadow-inner flex flex-col md:h-[800px]">
      <div className="flex-shrink-0 flex flex-col gap-4 mb-4 pb-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Trophy className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black italic text-on-surface uppercase tracking-tight">Hall of Fame</h2>
            <p className="text-xs text-on-surface-variant font-medium">Top performers and legends of the gloom</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setSortMode('posts')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'posts' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <Zap size={14} /> Top Posts
          </button>
          <button 
            onClick={() => setSortMode('consistency')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'consistency' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <TrendingUp size={14} /> Consistency
          </button>
          <button 
            onClick={() => setSortMode('fng')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'fng' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <Calendar size={14} /> New Guys
          </button>
        </div>
      </div>
      
      <div className="grid grid-rows-[repeat(3,auto)] grid-flow-col auto-cols-[85%] overflow-x-auto gap-3 pb-4 -mx-2 px-2 snap-x md:grid-rows-none md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:gap-4 md:overflow-y-auto md:content-start md:pr-2 md:-mr-2 md:pb-0 md:flex-1">
        {sortedPax.map((p, i) => {
          const stats = calculateRPGStats(p);
          const isLegend = stats.class === 'Legend';
          const rank = i + 1;
          
          let RankIcon = null;
          if (rank === 1) RankIcon = <Crown size={20} className="text-yellow-400 fill-yellow-400/20" />;
          else if (rank === 2) RankIcon = <Medal size={20} className="text-zinc-300 fill-zinc-300/20" />;
          else if (rank === 3) RankIcon = <Medal size={20} className="text-amber-600 fill-amber-600/20" />;
          
          return (
            <button
              key={p.name}
              onClick={() => onPaxClick(p)}
              className={`snap-center flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] group text-left w-full
                ${rank <= 3 ? 'bg-surface-container-high border-primary/20' : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container-high'}
              `}
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/20 font-black text-lg text-on-surface-variant group-hover:border-primary/50 group-hover:text-primary transition-colors">
                {RankIcon || <span className="opacity-50">#{rank}</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">{p.name}</span>
                  {isLegend && <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary text-on-primary uppercase tracking-wider">Legend</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                  <span className="font-medium">{stats.class}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="font-medium">
                    {sortMode === 'consistency' ? `${p.consistency}% Attendance` : 
                     sortMode === 'fng' ? `Joined ${p.firstBD}` : 
                     `${p.posts} Posts`}
                  </span>
                </div>
              </div>
              
              <div className="hidden sm:flex flex-wrap justify-end gap-1 max-w-[30%]">
                {p.awards.slice(0, 3).map(a => (
                  <AwardBadge key={a} award={a} />
                ))}
                {p.awards.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface-variant">+{p.awards.length - 3}</span>
                )}
              </div>
              
              <div className="sm:hidden">
                <div className="text-xl font-black text-primary">
                  {sortMode === 'consistency' ? `${p.consistency}%` : p.posts}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
};