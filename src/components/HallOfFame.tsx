import { useMemo, useState } from 'react';
import { Medal, Crown, Zap, TrendingUp, Calendar } from 'lucide-react';
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
  const [sortMode, setSortMode] = useState<SortMode>('consistency');

  const sortedPax = useMemo(() => {
    let sorted = [...paxList];
    
    if (sortMode === 'consistency') {
      sorted.sort((a, b) => b.consistency - a.consistency);
    } else if (sortMode === 'fng') {
      // Filter for anyone who has at least one FNG record in their attendance history
      sorted = sorted.filter(p => p.fngCount !== undefined && p.fngCount > 0);
      // Sort by First BD descending (Newest first)
      sorted.sort((a, b) => {
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
    <DashboardCard className="shadow-md flex flex-col md:h-[800px]">
      <div className="flex-shrink-0 flex flex-col gap-4 mb-4 pb-4 border-b border-outline-variant/10">
        {/* Active Metric Indicator */}
        <div className="flex items-center gap-2 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
            Live Ranking: <span className="text-primary">
              {sortMode === 'consistency' ? 'Consistency %' : sortMode === 'fng' ? 'Recruitment (FNGS)' : 'Total Volume (Posts)'}
            </span>
          </span>
        </div>
        {/* Sort Controls */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setSortMode('consistency')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'consistency' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <TrendingUp size={16} /> Consistency
          </button>
          <button 
            onClick={() => setSortMode('fng')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'fng' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <Calendar size={16} /> Filter FNGS
          </button>
          <button 
            onClick={() => setSortMode('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all whitespace-nowrap
              ${sortMode === 'posts' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/50'}
            `}
          >
            <Zap size={16} /> Top Posts
          </button>
        </div>
      </div>
      
      <div className="grid grid-rows-[repeat(3,auto)] grid-flow-col auto-cols-[48%] overflow-x-auto gap-2 pb-4 -mx-2 px-2 snap-x md:grid-rows-none md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:gap-4 md:overflow-y-auto md:content-start md:pr-2 md:-mr-2 md:pb-0 md:flex-1">
        {sortedPax.map((p, i) => {
          const stats = calculateRPGStats(p);
          const rank = i + 1;
          
          let RankIcon = null;
          if (rank === 1) RankIcon = <Crown size={20} className="text-yellow-400 fill-yellow-400/20" />;
          else if (rank === 2) RankIcon = <Medal size={20} className="text-zinc-300 fill-zinc-300/20" />;
          else if (rank === 3) RankIcon = <Medal size={20} className="text-amber-600 fill-amber-600/20" />;
          
          return (
            <button
              key={p.name}
              onClick={() => onPaxClick(p)}
              className={`snap-center flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-2xl border transition-all active:scale-[0.98] group text-left w-full
                ${rank <= 3 ? 'bg-surface-container-high border-primary/20' : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container-high'}
              `}
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-surface-container border border-outline-variant/20 font-black text-sm md:text-base text-on-surface-variant group-hover:border-primary/50 group-hover:text-primary transition-colors">
                {RankIcon || <span className="opacity-50">#{rank}</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">{p.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] md:text-xs text-on-surface-variant">
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
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
};