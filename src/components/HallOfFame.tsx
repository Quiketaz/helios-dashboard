import { Trophy } from 'lucide-react';
import { AwardBadge } from './AwardBadge';
import { calculateRPGStats } from '../utils/f3Logic';
import type { PaxData } from '../types';

interface HallOfFameProps {
  paxList: PaxData[];
  onPaxClick: (pax: PaxData) => void;
}

export const HallOfFame = ({ paxList, onPaxClick }: HallOfFameProps) => {
  return (
    <div className="bg-surface-container border border-outline-variant/20 rounded-[2.5rem] p-6 md:p-8 shadow-inner">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-primary" size={24} />
        <h2 className="text-xl md:text-2xl font-black italic text-on-surface uppercase tracking-tight">Hall of Fame</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {paxList.slice(0, 20).map((p, i) => {
          const stats = calculateRPGStats(p);
          const isLegend = stats.class === 'Legend';
          
          return (
            <button
              key={p.name}
              onClick={() => onPaxClick(p)}
              className="w-full flex flex-col p-3 md:p-5 bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-high transition-all active:scale-[0.98] group text-left shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-black italic text-base md:text-lg w-5 md:w-6 opacity-40 group-hover:opacity-100 transition-opacity">{(i + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <div className="text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isLegend ? 'text-primary' : 'text-on-surface-variant'}`}>{stats.class}</div>
                  </div>
                </div>
                <span className="text-lg md:text-xl font-black text-primary">{p.posts}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-outline-variant/20">
                {p.awards.length > 0 ? p.awards.map(a => (
                  <AwardBadge key={a} award={a} />
                )) : <span className="text-[9px] text-on-surface-variant/50 font-bold uppercase italic">No Awards</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};