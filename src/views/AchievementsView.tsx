import { getAwardIcon } from '../utils/f3';
import { Logo } from '../components/Logo';
import { Target, Map, Crown } from 'lucide-react';

export const AchievementsView = () => {
  const achievements = [
    {
      name: 'The Cindy',
      key: 'Cindy',
      criteria: '10 Posts',
      description: 'Named after the benchmark WOD. Reaching 10 posts signifies you have built the habit and are locked in.',
      rarity: 'Common',
      color: 'text-on-surface-variant'
    },
    {
      name: 'The Mug',
      key: 'Mug',
      criteria: '75 Posts',
      description: 'A pillar of the community. 75 posts demonstrates consistency and dedication to the gloom.',
      rarity: 'Uncommon',
      color: 'text-blue-400'
    },
    {
      name: 'Centurion',
      key: 'Shirt', // Maps to 👕
      criteria: '100 Posts',
      description: 'The elite. 100 posts. You have achieved the century mark.',
      rarity: 'Rare',
      color: 'text-primary'
    },
    {
      name: 'The Headband',
      key: 'Headband',
      criteria: '250 Posts',
      description: 'You have earned your stripes. A Headband marks the transition from participant to committed leader.',
      rarity: 'Legendary',
      color: 'text-red-400'
    }
  ];

  const missions = [
    {
      name: 'CSAUP',
      criteria: 'Event',
      description: 'Completed a Completely Stupid And Utterly Pointless event.',
      icon: '🏔️',
      rarity: 'Epic',
      color: 'text-purple-400'
    },
    {
      name: 'Iron Pax',
      criteria: 'Challenge',
      description: 'Participated in the annual Iron Pax Challenge.',
      icon: '⚔️',
      rarity: 'Legendary',
      color: 'text-primary'
    },
    {
      name: 'Q Source',
      criteria: 'Leadership',
      description: 'Attended Q Source leadership development training.',
      icon: '🧠',
      rarity: 'Rare',
      color: 'text-blue-400'
    }
  ];

  const journey = [
    { name: 'FNG', desc: 'Show up. Work out.', icon: '🌱' },
    { name: 'The Naming', desc: 'Earn your handle.', icon: '🏷️' },
    { name: 'First Post', desc: 'The gloom calls.', icon: '👊' },
    { name: 'First Q', desc: 'Lead the PAX.', icon: '📢' },
    { name: 'HIM', desc: 'High Impact Man.', icon: '🔥' }
  ];

  return (
    <div className="space-y-12 pb-24 lg:pb-0 animate-in fade-in duration-500">
       {/* Header */}
      <div className="flex flex-col md:items-center justify-center pt-4 pb-2">
        <div className="flex flex-wrap justify-center items-center gap-3 mb-1 md:mb-2">
          <Logo size="sm" />
          <h1 className="text-2xl md:text-4xl font-black text-on-surface italic tracking-tighter uppercase">
            Hall of <span className="text-primary">Glory</span>
          </h1>
        </div>
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[0.625rem] md:text-xs">
          Achievements & Milestones
        </p>
      </div>

      {/* Hall of Glory */}
      <section>
      <div className="flex items-center gap-2 mb-4 px-2">
        <Crown className="text-primary" size={20} />
        <h2 className="text-lg font-black text-on-surface uppercase tracking-wider">Hall of Glory</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((award) => (
          <div 
            key={award.key}
            className="relative overflow-hidden bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 hover:bg-surface-container-high transition-all group"
          >
            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none rotate-12 text-on-surface scale-150">
               {/* Background Icon Effect */}
               <span className="text-9xl grayscale">{getAwardIcon(award.key)}</span>
            </div>

            <div className="relative z-10 flex items-start gap-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-4xl shadow-inner">
                {getAwardIcon(award.key)}
              </div>
              
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
                  <span className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    award.rarity === 'Legendary' ? 'bg-primary/10 text-primary border-primary/20' :
                    award.rarity === 'Rare' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    award.rarity === 'Uncommon' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-surface-container text-on-surface-variant border-outline-variant/20'
                  }`}>
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
          {missions.map((mission) => (
            <div key={mission.name} className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{mission.icon}</span>
                <span className={`text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-surface-container ${mission.color.replace('text-', 'border-').replace('400', '500/20')} ${mission.color}`}>
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