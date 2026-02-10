import { useMemo } from 'react';
import { Zap, Users, TrendingUp, MapPin, Trophy, Calendar, Star } from 'lucide-react';
import type { PaxData, QRecord } from '../types';
import { StatCard } from '../components/StatCard';

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
        try { return parseDate(q.date) >= today; }
        catch { return false; }
      })
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())[0];
  }, [qList]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 pb-20 lg:pb-0">
    <div className="lg:col-span-8 space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Posts" value={paxList.reduce((a, b) => a + b.posts, 0).toLocaleString()} icon={<Zap size={20}/>} />
        <StatCard title="Total PAX" value={paxList.length.toString()} icon={<Users size={20}/>} />
        <StatCard title="Avg Consistency" value={`${Math.round(paxList.reduce((acc, p) => acc + p.consistency, 0) / (paxList.length || 1))}%`} icon={<TrendingUp size={20}/>} />
        <StatCard title="Home AO" value="Helios" icon={<MapPin size={20}/>} />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-inner">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-yellow-400" size={24} />
          <h2 className="text-xl md:text-2xl font-black italic text-white uppercase tracking-tight">Hall of Fame</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {paxList.slice(0, 20).map((p, i) => (
            <button
              key={p.name}
              onClick={() => onPaxClick(p)}
              className="w-full flex flex-col p-4 md:p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 hover:border-yellow-400/50 hover:bg-zinc-900/50 transition-all active:scale-[0.98] group text-left shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-700 font-black italic text-lg w-6">{(i + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <div className="font-bold text-white group-hover:text-yellow-400 transition-colors">{p.name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{p.posts >= 100 ? 'Legend' : p.posts >= 50 ? 'Commander' : 'Warrior'}</div>
                  </div>
                </div>
                <span className="text-xl font-black text-yellow-400">{p.posts}</span>
              </div>
              
              <div className="flex gap-2 mt-auto pt-2 border-t border-zinc-800/50">
                {p.awards.length > 0 ? p.awards.map(a => {
                  const isShirt = a.toLowerCase().startsWith('shirt');
                  const shirtOrder = isShirt && a.includes(':') ? a.split(':')[1] : null;
                  
                  return (
                    <span key={a} className="flex items-center gap-1 text-base" title={a}>
                      {a.startsWith('Cindy') ? '🧱' : a.startsWith('Mug') ? '☕' : '👕'}
                      {shirtOrder && (
                        <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md border border-yellow-500/30">
                          #{shirtOrder}
                        </span>
                      )}
                    </span>
                  );
                }) : <span className="text-[10px] text-zinc-700 font-bold uppercase italic">No Awards</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Sidebar Content */}
    <div className="lg:col-span-4 space-y-6">
      {/* Next Workout Spotlight */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2rem] p-1 text-black">
        <div className="bg-zinc-950 rounded-[1.8rem] p-6 h-full">
          <div className="flex items-center gap-2 mb-4 text-yellow-400">
            <Calendar size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Next Beatdown</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-1">{nextQ?.date || 'TBD'}</h3>
          <p className="text-zinc-400 font-bold mb-6">05:30 @ Helios</p>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-black text-black">Q</div>
              <span className="font-bold text-white">{nextQ?.q || 'OPEN'}</span>
            </div>
            {!nextQ?.q && <Star className="text-yellow-400 animate-pulse" size={20} fill="currentColor" />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};