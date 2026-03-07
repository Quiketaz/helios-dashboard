import { Target, Map, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ACHIEVEMENTS, SPECIALTY_MISSIONS, getRarityColor } from '../utils/achievements';

// --- Reusable Badge Component ---
const AchievementBadge = ({ icon: Icon, rarity }: { icon: LucideIcon; rarity: string }) => {
  // Rarity Color Logic
  const getStyles = () => {
    const base = getRarityColor(rarity);
    // Add glow effects specific to this view
    if (rarity === 'Legendary') return `${base} shadow-[0_0_20px_rgba(239,68,68,0.4)]`;
    if (rarity === 'Rare') return `${base} shadow-[0_0_15px_rgba(255,215,0,0.4)]`;
    if (rarity === 'Epic') return `${base} shadow-[0_0_15px_rgba(192,132,252,0.4)]`;
    if (rarity === 'Uncommon') return `${base} shadow-[0_0_10px_rgba(96,165,250,0.3)]`;
    return base;
  };

  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${getStyles()}`}>
      <Icon size={32} strokeWidth={1.5} />
    </div>
  );
};

export const AchievementsView = () => {
  const journey = [
    { name: 'FNG', desc: 'Show up. Work out.', icon: '🌱' },
    { name: 'The Naming', desc: 'Earn your handle.', icon: '🏷️' },
    { name: 'First Post', desc: 'The gloom calls.', icon: '👊' },
    { name: 'First Q', desc: 'Lead the PAX.', icon: '📢' },
    { name: 'HIM', desc: 'High Impact Man.', icon: '🔥' }
  ];

  return (
    <div className="space-y-12 pb-24 lg:pb-0 animate-in fade-in duration-500">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black italic text-on-surface uppercase tracking-tighter">
          Hall of <span className="text-primary">Glory</span>
        </h1>
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Achievements & Milestones</p>
      </div>

      {/* Hall of Glory */}
      <section>
      <div className="flex items-center gap-2 mb-4 px-2">
        <Crown className="text-primary" size={20} />
        <h2 className="text-lg font-black text-on-surface uppercase tracking-wider">Hall of Glory</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((award) => (
          <div 
            key={award.id}
            className="relative overflow-hidden bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 hover:bg-surface-container-high transition-all group"
          >
            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none rotate-12 text-on-surface scale-150">
               <award.icon size={120} />
            </div>

            <div className="relative z-10 flex items-start gap-5">
              <AchievementBadge icon={award.icon} rarity={award.rarity} />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">
                    {award.name}
                  </h3>
                  <span className="text-[0.625rem] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/20">
                    {award.criteria}
                  </span>
                </div>
                
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium mb-3">
                  {award.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRarityColor(award.rarity)}`}>
                    {award.rarity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>

      {/* Specialty Missions */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <Target className="text-primary" size={20} />
          <h2 className="text-lg font-black text-on-surface uppercase tracking-wider">Specialty Missions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SPECIALTY_MISSIONS.map((mission) => (
            <div key={mission.name} className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center justify-between mb-2">
                <mission.icon size={24} className={mission.rarity === 'Legendary' ? 'text-primary' : mission.rarity === 'Epic' ? 'text-purple-400' : mission.rarity === 'Rare' ? 'text-blue-400' : 'text-on-surface-variant'} />
                <span className="text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-surface-container border-outline-variant/20 text-on-surface-variant">
                  {mission.rarity}
                </span>
              </div>
              <h3 className="text-base font-black text-on-surface uppercase tracking-tight mb-1">{mission.name}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{mission.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Journey */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <Map className="text-primary" size={20} />
          <h2 className="text-lg font-black text-on-surface uppercase tracking-wider">The Journey</h2>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/20 -translate-y-1/2 hidden md:block" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {journey.map((step, i) => (
              <div key={step.name} className="relative bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex flex-col items-center text-center z-10 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-xl mb-2 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-sm font-black text-on-surface uppercase tracking-tight">{step.name}</h3>
                <p className="text-[0.625rem] text-on-surface-variant font-bold uppercase tracking-wider mt-1">{step.desc}</p>
                {i < 2 && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};