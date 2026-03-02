import { useMemo } from 'react';
import { Trophy, Calendar, Target, Instagram } from 'lucide-react';
import type { PaxData, QRecord } from '../types';
import { AwardBadge } from '../components/AwardBadge';
import { OperatorCard } from '../components/OperatorCard';
import { WeatherCard } from '../components/WeatherCard';

// Helper: Parse date string (M/D/YYYY format) to Date object
const parseDate = (dateStr: string): Date => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const DashboardView = ({ paxList, qList, onPaxClick }: { paxList: PaxData[], qList: QRecord[], onPaxClick: (pax: PaxData) => void }) => {
  const nextQ = useMemo(() => {
    if (!qList || qList.length === 0) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return [...qList]
      .filter(q => {
        try { return parseDate(q.date) > today; }
        catch { return false; }
      })
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())[0];
  }, [qList]);

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <OperatorCard 
            name="Site Lead" 
            operatorId="HELIOS-ALPHA" 
            shieldStrength={92} 
            rank="COMMANDER" 
          />
        </div>
        <WeatherCard />
        <div className="rounded-3xl bg-surface-container p-8 flex flex-col justify-center border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-primary" size={24} />
            <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Next Beatdown</h3>
          </div>
          <div className="text-3xl font-black text-primary mb-1">
            {nextQ ? nextQ.date : 'TBD'}
          </div>
          <div className="text-lg font-medium text-on-surface-variant">
            {nextQ ? (nextQ.q || 'OPEN') : 'No upcoming schedule'}
          </div>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant/20 rounded-[2.5rem] p-6 md:p-8 shadow-inner">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-primary" size={24} />
          <h2 className="text-xl md:text-2xl font-black italic text-on-surface uppercase tracking-tight">Hall of Fame</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {paxList.slice(0, 20).map((p, i) => {
            const isLegend = p.posts >= 100;
            const status = isLegend ? 'Legend' : p.posts >= 50 ? 'Commander' : 'Warrior';
            
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
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${isLegend ? 'text-primary' : 'text-on-surface-variant'}`}>{status}</div>
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

      {/* The F3 Way & AO Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container border border-outline-variant/20 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
          <h3 className="text-xl font-black italic text-on-surface uppercase mb-6 flex items-center gap-2">
            <Target size={20} className="text-primary" />
            The F3 Mission
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            To plant, grow and serve small men’s workout groups for the <span className="text-on-surface font-bold">invigoration of male leadership</span> in the community.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Free', 'All Men', 'Outdoors', 'Peer-led', 'Circle of Trust'].map((pillar) => (
              <span key={pillar} className="px-3 py-1 bg-surface-container-highest border border-outline-variant/10 rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                {pillar}
              </span>
            ))}
          </div>
        </div>

        <a 
          href="https://www.instagram.com/f3northkaty_helios/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-outline-variant/20 rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center justify-center text-center transition-all hover:border-pink-500/50 shadow-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
          <Instagram size={40} className="text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-black italic text-on-surface uppercase tracking-tighter">
            Follow Helios
          </h3>
          <p className="text-on-surface-variant text-xs mt-1">@f3northkaty_helios</p>
          <div className="mt-4 px-4 py-2 bg-surface-container-highest/50 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-surface-container-highest transition-colors text-on-surface">
            View Gallery
          </div>
        </a>
      </div>
    </div>
  );
};