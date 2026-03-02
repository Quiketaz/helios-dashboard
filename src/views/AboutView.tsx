//import React from 'react';
import { Shield, Users, Sun, Target, MessageCircle, HeartHandshake } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

export const AboutView = () => {
  const pillars = [
    { label: 'Free of Charge', icon: Shield },
    { label: 'Open to all Men', icon: Users },
    { label: 'Held Outdoors', icon: Sun },
    { label: 'Peer Led', icon: Target },
    { label: 'Ends with a COT', icon: MessageCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black italic text-primary uppercase tracking-tighter">About F3</h2>
        <p className="text-on-surface-variant font-medium">Fitness, Fellowship, and Faith.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5 Pillars Compact Card */}
        <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-primary" />
            <h3 className="text-lg font-black italic text-on-surface uppercase tracking-tight">The 5 Pillars</h3>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
            F3 workouts are held to these five core principles, ensuring consistency across the gloom.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pillars.map((pillar) => (
              <span key={pillar.label} className="flex items-center gap-1 px-2 py-0.5 bg-surface-container-highest border border-outline-variant/10 rounded-md text-[9px] font-black uppercase tracking-wider text-on-surface-variant">
                <pillar.icon size={10} className="text-primary" />
                {pillar.label}
              </span>
            ))}
          </div>
        </div>

        {/* Credo Card */}
        <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-5 shadow-sm flex flex-col justify-center">
           <div className="flex items-center gap-2 mb-3">
            <HeartHandshake size={18} className="text-primary" />
            <h3 className="text-lg font-black italic text-on-surface uppercase tracking-tight">The Credo</h3>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed italic">
            "Leave no man behind, but leave no man where you found him."
          </p>
          <div className="mt-4 flex items-center gap-2">
             <div className="h-0.5 flex-1 bg-outline-variant/10"></div>
             <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">F3 Nation</span>
             <div className="h-0.5 flex-1 bg-outline-variant/10"></div>
          </div>
        </div>
      </div>
      
      <DashboardCard className="p-6 border border-outline-variant/20">
        <h3 className="text-lg font-bold text-on-surface mb-4 uppercase tracking-wide">What is F3?</h3>
        <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
          <p>
            F3 is a national network of free, peer-led workouts for men. Our mission is to plant, grow and serve small workout groups for the invigoration of male leadership in the community.
          </p>
          <p>
            The three Fs stand for <strong className="text-primary">Fitness</strong>, <strong className="text-primary">Fellowship</strong>, and <strong className="text-primary">Faith</strong> — the last of which we define as not one specific religion or faith system, but simply a belief in something outside of oneself.
          </p>
        </div>
      </DashboardCard>
    </div>
  );
};