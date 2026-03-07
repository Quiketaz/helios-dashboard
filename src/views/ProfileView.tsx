import { useState, useMemo } from 'react';
import { Sword, Shield, Zap, Award, Calendar, TrendingUp, History, Share, ChevronDown, ChevronUp, Crown } from 'lucide-react';
//import type { PaxData } from '../types';
import { RadialAttribute } from '../components/RadialAttribute';
import { getClassColor, getClassBgColor, getClassTextColor } from '../utils/utils';
import { calculateRPGStats } from '../utils/f3Logic';
import { useData } from '../context/DataContext';
import { ShareProfile } from '../components/ShareProfile';
import { usePaxAchievements } from '../hooks/usePaxAchievements';
import { ACHIEVEMENTS } from '../utils/achievements';

export const ProfileView = () => {
  const { selectedPax: rawPax, setSelectedPax } = useData();
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isJourneyExpanded, setIsJourneyExpanded] = useState(false);

  // Use shared hook to normalize pax data and apply dynamic achievements
  const pax = usePaxAchievements(rawPax);

  if (!pax) return null;

  const onBack = () => setSelectedPax(null);

  const stats = calculateRPGStats(pax); // Calculate RPG metrics based on PAX attendance
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

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

  // Calculate progress to next milestone
  const currentPosts = pax.posts;
  const nextMilestone = ACHIEVEMENTS.find(m => (m.target || 0) > currentPosts);
  const prevMilestone = [...ACHIEVEMENTS].reverse().find(m => (m.target || 0) <= currentPosts);
  
  let progressPercent = 0;
  let progressLabel = '';
  let nextMilestoneDisplay = null;

  if (nextMilestone) {
    const prevCount = prevMilestone ? (prevMilestone.target || 0) : 0;
    const totalRange = (nextMilestone.target || 0) - prevCount;
    const progress = currentPosts - prevCount;
    progressPercent = Math.min(100, Math.max(0, (progress / totalRange) * 100));
    progressLabel = `${(nextMilestone.target || 0) - currentPosts} posts until ${nextMilestone.name}`;
    nextMilestoneDisplay = nextMilestone;
  } else {
    progressPercent = 100;
    progressLabel = 'All milestones achieved!';
    nextMilestoneDisplay = { name: 'Legend', icon: Crown, target: currentPosts };
  }

  // Mobile Journey Toggle
  const visibleMilestones = isJourneyExpanded ? milestones : milestones.slice(0, 1);

  return (
    <div className="fixed inset-0 bg-surface z-50 flex flex-col lg:static lg:h-screen lg:overflow-hidden selection:bg-primary/30">
      
      {/* Mobile Sticky Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <span className="font-black text-on-surface uppercase tracking-tight truncate max-w-[200px]">
            {pax.name}
          </span>
        </div>
        <button
          onClick={() => setShareModalOpen(true)}
          className="p-2 -mr-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <Share size={20} />
        </button>
      </header>

      {/* Desktop Header / Controls */}
      <div className="hidden lg:flex items-center justify-between p-6 pb-0">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-surface-container-highest hover:bg-surface-container-high border border-outline-variant/30 rounded-2xl text-primary font-black text-sm transition-all flex items-center gap-2"
        >
          <span>←</span> BACK TO ROSTER
        </button>
        <button
          onClick={() => setShareModalOpen(true)}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-2xl font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Share size={16} /> SHARE PROFILE
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
          
          {/* LEFT COLUMN: Identity & Progress */}
          <div className="flex flex-col gap-4 lg:overflow-y-auto no-scrollbar lg:pr-2">
            {/* Hero Card */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b ${classColor} p-6 lg:p-8 shadow-lg`}>
              <div className="absolute inset-0 opacity-20 bg-surface mix-blend-multiply" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`mb-4 inline-block px-4 py-1.5 rounded-full border ${classBg} ${classText} font-black text-[10px] uppercase tracking-widest shadow-sm`}>
                  {stats.class}
                </div>
                <h1 className="text-4xl lg:text-5xl font-black italic text-on-surface uppercase tracking-tighter drop-shadow-sm mb-2">
                  {pax.name}
                </h1>
                <div className="flex items-center gap-2 text-primary-container font-black bg-surface/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Zap size={18} fill="currentColor" />
                  <span className="uppercase tracking-tight">{pax.posts} Posts</span>
                </div>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Next Objective</span>
                  <span className="text-lg font-black text-on-surface flex items-center gap-2">
                    {nextMilestoneDisplay.name}
                    <nextMilestoneDisplay.icon size={24} className="text-primary" />
                  </span>
                </div>
                <span className="text-2xl font-black text-primary">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20" />
                </div>
              </div>
              <div className="mt-3 text-right">
                <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">
                  {progressLabel}
                </span>
              </div>
            </div>

            {/* Class Description (Desktop Only - moved from bottom) */}
            <div className={`hidden lg:block bg-gradient-to-r ${classBg} border border-white/10 rounded-3xl p-6 backdrop-blur-xl`}>
              <h3 className={`text-sm font-black italic uppercase mb-2 ${classText}`}>
                {stats.class} Class
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {stats.class === 'Legend' && "Elite status. Unwavering dedication."}
                {stats.class === 'Commander' && "Strong leadership presence."}
                {stats.class === 'Guardian' && "Steady and reliable presence."}
                {stats.class === 'Warrior' && "Building strength. Every post counts."}
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Stats & Missions */}
          <div className="flex flex-col gap-4 lg:overflow-y-auto no-scrollbar lg:px-2">
            {/* Core Attributes */}
            <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sword size={14} /> Core Attributes
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <RadialAttribute label="Fitness" value={stats.fitness} max={100} icon={Zap} />
                <RadialAttribute label="Fellowship" value={stats.fellowship} max={100} icon={TrendingUp} />
                <RadialAttribute label="Impact" value={stats.impact} max={100} icon={Shield} />
              </div>
            </div>

            {/* Specialty Missions (Horizontal Scroll on Mobile) */}
            <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-4 lg:p-6 shadow-sm overflow-hidden">
              <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
                <History size={14} /> Specialty Missions
              </h3>
              <div className="flex lg:grid lg:grid-cols-2 gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                {[
                  { label: 'Proud Papa', count: pax.ppCount, icon: '☕' },
                  { label: 'Big Brother', count: pax.bbCount, icon: '📦' },
                  { label: 'Starsky', count: pax.starskyCount, icon: '⭐' },
                  { label: '2nd Helping', count: pax.secondHelpingCount, icon: '🍽️' },
                ].map((item) => (
                  <div key={item.label} className="snap-center shrink-0 w-28 lg:w-auto h-full bg-surface-container-low border border-outline-variant/10 rounded-2xl p-3 flex flex-col gap-1 group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div className="text-xl font-black text-on-surface">{item.count || 0}</div>
                    </div>
                    <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest truncate">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Journey & Achievements */}
          <div className="flex flex-col gap-4 lg:overflow-y-auto no-scrollbar lg:pl-2">
            {/* Journey Timeline */}
            <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> The Journey
                </h3>
                <span className={`text-xs font-black ${pax.consistency >= 50 ? 'text-green-500' : 'text-primary'}`}>
                  {pax.consistency}% Consistency
                </span>
              </div>
              
              <div className="relative pl-4 border-l border-outline-variant/20 space-y-6">
                {visibleMilestones.map((m, idx) => (
                  <div key={idx} className="relative pl-6 group animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface-container border-2 border-primary z-10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold text-on-surface">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Expand Toggle */}
              <button 
                onClick={() => setIsJourneyExpanded(!isJourneyExpanded)}
                className="lg:hidden w-full mt-6 py-3 flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-all"
              >
                {isJourneyExpanded ? (
                  <>Show Less <ChevronUp size={14} /></>
                ) : (
                  <>View Full History <ChevronDown size={14} /></>
                )}
              </button>
            </div>

            {/* Recent Achievements */}
            <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-4 lg:p-6 shadow-sm overflow-hidden">
              <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
                <Award size={14} /> Recent Honors
              </h3>
              <div className="flex lg:flex-col gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                {ACHIEVEMENTS.map((def) => {
                  const earnedAward = pax.awards.find(a => a.toLowerCase().startsWith(def.id));
                  const isEarned = !!earnedAward;
                  if (!isEarned) return null; // Only show earned in this compact view
                  
                  return (
                    <div key={def.id} className="snap-center shrink-0 w-40 lg:w-auto h-full flex items-center gap-2 p-3 bg-surface-container-high rounded-2xl border border-outline-variant/10">
                      <def.icon size={24} className="text-primary" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-on-surface truncate">{def.name}</div>
                        <div className="text-[9px] text-on-surface-variant truncate">{def.criteria}</div>
                      </div>
                    </div>
                  );
                })}
                {pax.awards.length === 0 && (
                  <div className="text-xs text-on-surface-variant/50 italic text-center py-4 w-full shrink-0">
                    No honors recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {isShareModalOpen && (
        <ShareProfile pax={pax} onClose={() => setShareModalOpen(false)} />
      )}
    </div>
  );
};
