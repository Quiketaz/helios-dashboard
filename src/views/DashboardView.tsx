import { useMemo, useState } from 'react';
import { Calendar, Target, Instagram, User } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PaxSpotlight } from '../components/OperatorCard';
import { WeatherCard } from '../components/WeatherCard';
import { HallOfFame } from '../components/HallOfFame';
import { useData } from '../context/DataContext';
//import type { parseDate } from './utils/dateUtils';
import { parseDate } from '../utils/dateUtils';


export const DashboardView = () => {
  const { filteredPax, qList, setSelectedPax } = useData();
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);

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

  const spotlightPax = useMemo(() => {
    const eligible = filteredPax.filter(p => p.posts > 50);
    if (eligible.length === 0) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }, [filteredPax]);

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black italic text-on-surface uppercase tracking-tighter">
          Command <span className="text-primary">Center</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="hidden md:block lg:col-span-2">
          <PaxSpotlight pax={spotlightPax} />
        </div>
        <div className="lg:col-span-2 h-full rounded-3xl bg-surface-container-high p-5 shadow-md relative overflow-hidden flex items-center justify-between gap-4">
          {/* Watermark Logo */}
          <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.03]">
            <Logo size="lg" />
          </div>

          {/* Left: Mission Info */}
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Next Beatdown</p>
            </div>
            <div className={`transition-all duration-500 ${isWeatherExpanded ? 'opacity-0 -translate-x-2 blur-sm' : 'opacity-100 translate-x-0 blur-0'}`}>
              <h2 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                {nextQ ? nextQ.date : 'TBD'}
              </h2>
              <div className="mt-1 inline-flex px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 font-bold text-[9px] uppercase tracking-widest text-primary">
                {nextQ ? (nextQ.type || 'Bootcamp') : 'Scheduled'}
              </div>
            </div>
          </div>

          {/* Right: Q Lead & Weather */}
          <div className="relative z-10 flex flex-col items-end gap-2">
            <div className={`transition-all duration-500 ${isWeatherExpanded ? 'opacity-0 translate-x-2 blur-sm' : 'opacity-100 translate-x-0 blur-0'}`}>
              <div className="flex items-center gap-1.5 bg-surface-container-highest px-2 py-1 rounded-lg border border-outline-variant/10">
                <User size={12} className="text-primary" />
                <span className="text-[11px] font-bold text-on-surface">{nextQ ? (nextQ.q || 'OPEN') : 'TBD'}</span>
              </div>
            </div>
            <WeatherCard isExpanded={isWeatherExpanded} onToggle={setIsWeatherExpanded} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <HallOfFame paxList={filteredPax} onPaxClick={setSelectedPax} />
      </div>

      {/* The F3 Way & AO Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container rounded-3xl p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-primary" />
            <h3 className="text-lg font-black italic text-on-surface uppercase tracking-tight">The F3 Mission</h3>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
            To plant, grow and serve small men’s workout groups for the <span className="text-on-surface font-bold">invigoration of male leadership</span> in the community.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Free', 'All Men', 'Outdoors', 'Peer-led', 'COT'].map((pillar) => (
              <span key={pillar} className="px-2 py-0.5 bg-surface-container-highest border border-outline-variant/10 rounded-md text-[9px] font-black uppercase tracking-wider text-on-surface-variant">
                {pillar}
              </span>
            ))}
          </div>
        </div>

        <a 
          href="https://www.instagram.com/f3northkaty_helios/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:ring-2 hover:ring-pink-500/50 shadow-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
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