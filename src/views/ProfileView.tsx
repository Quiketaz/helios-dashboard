import { useState, useMemo } from 'react';
import { Sword, Shield, Zap, Crown, Award, Calendar, TrendingUp, Info, History } from 'lucide-react';
//import type { PaxData } from '../types';
import { RadialAttribute } from '../components/RadialAttribute';
import { getClassColor, getClassBgColor, getClassTextColor } from '../utils/utils';
import { calculateRPGStats } from '../utils/f3Logic';
import { useData } from '../context/DataContext';

const ACHIEVEMENT_DEFS = [
  { id: 'shirt', name: 'Centurion', icon: '👕', requirement: 'Earned at 100 Posts', target: 100 },
  { id: 'mug', name: 'Mug', icon: '☕', requirement: 'Lead 10 Workouts', target: 10 },
  { id: 'cindy', name: 'Cindy', icon: '🧱', requirement: 'Complete the Cindy Challenge', target: 1 },
];

export const ProfileView = () => {
  const { selectedPax: pax, setSelectedPax } = useData();

  if (!pax) return null;

  const onBack = () => setSelectedPax(null);

  const stats = calculateRPGStats(pax); // Calculate RPG metrics based on PAX attendance
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

  const [activeTab, setActiveTab] = useState<'achievements' | 'journey'>('achievements');

  // Filter attendance to only show significant milestones
  const milestones = useMemo(() => {
    const m = [
      { label: 'Latest Mission', date: pax.lastBD },
    ];

    if (pax.vqDate) {
      m.push({ label: 'First Q (VQ)', date: pax.vqDate });
    }

    m.push({ label: 'Initial Deployment', date: pax.firstBD });
    return m;
    }, [pax.firstBD, pax.lastBD, pax.vqDate]);
  return (
    <div className="min-h-screen bg-surface pb-20 selection:bg-primary/30">
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 px-3 py-2 md:px-5 md:py-2.5 bg-surface-container-highest/95 backdrop-blur-xl hover:bg-surface-container-highest border border-outline-variant/30 rounded-xl md:rounded-2xl text-primary font-black text-[10px] md:text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
      >
        <span className="text-lg leading-none">←</span> BACK
      </button>

      {/* Hero Section */}
      <div className={`relative pt-16 md:pt-32 pb-12 md:pb-40 bg-gradient-to-b ${classColor} transition-all duration-500`}>
        <div className="absolute inset-0 opacity-20 bg-surface" />
        <div className="relative px-4 md:px-10 text-center space-y-2 md:space-y-4">
          <div className={`inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full border ${classBg} ${classText} font-black text-[10px] md:text-sm uppercase tracking-widest`}>
            {stats.class}
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic text-on-surface uppercase tracking-tighter drop-shadow-lg leading-none">{pax.name}</h1>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Zap size={20} fill="currentColor" />
            <span className="text-2xl md:text-3xl font-black uppercase tracking-tight">{pax.posts} Posting Count</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-3 md:px-10 -mt-6 md:-mt-24 relative z-10 max-w-5xl mx-auto space-y-4 md:space-y-8">
        {/* Core Attributes */}
        <div className="bg-surface-container border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-4 md:p-12 shadow-sm">
          <div className="mb-6 md:mb-10 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-black italic text-on-surface uppercase flex items-center justify-center md:justify-start gap-3 tracking-tighter">
              <Sword size={24} className="text-primary" />
              Core Attributes
            </h2>
            <p className="text-on-surface-variant text-xs md:text-sm mt-2 font-medium leading-relaxed max-w-2xl">
              Tactical metrics derived from mission history. <span className="text-primary/80">Fitness</span> tracks total volume, <span className="text-primary/80">Fellowship</span> measures consistency, and <span className="text-primary/80">Impact</span> represents community leadership.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-12">
            <RadialAttribute
              label="Fitness"
              value={stats.fitness}
              max={100}
              icon={Zap}
            />
            <RadialAttribute
              label="Fellowship"
              value={stats.fellowship}
              max={100}
              icon={TrendingUp}
            />
            <RadialAttribute
              label="Impact"
              value={stats.impact}
              max={100}
              icon={Shield}
            />
          </div>
        </div>

        {/* Specialty Missions */}
        <div className="bg-surface-container border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm">
          <h3 className="text-xl font-black italic text-primary uppercase mb-6 flex items-center gap-2">
            <History size={18} />
            Specialty Missions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Proud Papa', count: pax.ppCount, icon: '☕' },
              { label: 'Big Brother', count: pax.bbCount, icon: '📦' },
              { label: 'Starsky', count: pax.starskyCount, icon: '⭐' },
              { label: '2nd Helping', count: pax.secondHelpingCount, icon: '🍽️' },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 text-center group hover:border-primary/30 transition-colors">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-2xl font-black text-on-surface">{item.count || 0}</div>
                <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Tab Switcher (M3 Segmented Button Style) */}
        <div className="flex md:hidden bg-surface-container-low p-1 rounded-2xl border border-outline-variant/20">
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'achievements' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}
          >
            <Award size={16} />
            Awards
          </button>
          <button 
            onClick={() => setActiveTab('journey')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'journey' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'}`}
          >
            <History size={16} />
            Journey
          </button>
        </div>

        {/* Character Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Achievements - Visible on Desktop or when Tab is active */}
          <div className={`${activeTab === 'achievements' ? 'block' : 'hidden md:block'} bg-surface-container border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm`}>
            <h3 className="text-xl font-black italic text-primary uppercase mb-6 flex items-center gap-2">
              <Award size={18} />
              Achievements
            </h3>
            <div className="space-y-3">
              {ACHIEVEMENT_DEFS.map((def) => {
                const earnedAward = pax.awards.find(a => a.toLowerCase().startsWith(def.id));
                const isEarned = !!earnedAward;
                const isShirt = def.id === 'shirt';
                const shirtOrder = earnedAward?.includes(':') ? earnedAward.split(':')[1] : null;
                const displayName = shirtOrder ? `Centurion #${shirtOrder}` : def.name;
                const hasGlow = isShirt && pax.posts >= 100;

                return (
                  <div 
                    key={def.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all shadow-md ${
                      isEarned 
                        ? 'bg-surface-container-highest border-outline-variant/30' 
                        : 'bg-surface-container-low/50 border-outline-variant/10 opacity-60'
                    } ${hasGlow ? 'shadow-[0_0_20px_rgba(255,215,0,0.2)] border-primary/40' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner relative ${
                        isEarned 
                          ? (isShirt ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-primary-container') 
                          : 'bg-surface-container-highest text-on-surface-variant/30'
                      }`}>
                        {def.icon}
                        {shirtOrder && (
                          <span className="absolute -bottom-1 -right-1 bg-surface-container-highest text-[8px] font-black px-1 rounded-sm border border-outline-variant/20 text-on-surface">
                            #{shirtOrder}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className={`font-bold capitalize block ${isEarned ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
                          {displayName}
                        </span>
                        {isEarned && isShirt && (
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest">100 Beatdowns Milestone</span>
                        )}
                        {!isEarned && (
                          <span className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest italic">Locked</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="group relative">
                        <button className="p-1.5 rounded-full hover:bg-on-surface/5 text-on-surface-variant/40 transition-colors">
                          <Info size={14} />
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-surface-container-highest border border-outline-variant rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          <p className="text-[10px] font-bold text-on-surface uppercase tracking-wider mb-1">Requirement</p>
                          <p className="text-[11px] text-on-surface-variant leading-tight">{def.requirement}</p>
                        </div>
                      </div>
                      {isEarned && isShirt && <Crown size={16} className="text-primary animate-pulse" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Journey - Visible on Desktop or when Tab is active */}
          <div className={`${activeTab === 'journey' ? 'block' : 'hidden md:block'} bg-surface-container border border-outline-variant/20 rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black italic text-primary uppercase flex items-center gap-2">
                <Calendar size={18} />
                Journey
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Consistency</span>
                <span className={`text-lg font-black ${pax.consistency >= 50 ? 'text-green-500' : 'text-primary'}`}>
                  {pax.consistency}%
                </span>
              </div>
            </div>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-outline-variant/30" />
              
              <div className="space-y-6">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center z-10 transition-colors group-hover:border-primary/40">
                      <div className="w-2 h-2 rounded-full bg-primary/60" />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold text-on-surface">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Class Description */}
        <div className={`bg-gradient-to-r ${classBg} border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl`}>
          <h3 className={`text-lg font-black italic uppercase mb-3 ${classText}`}>
            {stats.class} Class Info
          </h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {stats.class === 'Legend' &&
              "You've reached elite status! Your unwavering dedication and exceptional consistency make you a beacon for the community. You embody the true spirit of the Gloom."}
            {stats.class === 'Commander' &&
              'Strong leadership presence! Your solid consistency and experience position you as someone others look up to. Keep leading by example.'}
            {stats.class === 'Guardian' &&
              'A steady and reliable presence! Your balanced approach shows you care about your fitness journey. Keep building that consistency.'}
            {stats.class === 'Warrior' &&
              "You're building your strength! Every post is a step forward. Keep pushing and watch your legend grow."}
          </p>
        </div>
      </div>
    </div>
  );
};
