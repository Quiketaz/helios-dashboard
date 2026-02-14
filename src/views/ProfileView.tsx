import React from 'react';
import { Sword, Shield, Zap, Crown, Award, Calendar, MapPin, TrendingUp, Instagram, Target } from 'lucide-react';
import type { PaxData } from '../types';
import { calculateRPGStats, getClassColor, getClassBgColor, getClassTextColor } from '../utils';

interface ProfileViewProps {
  pax: PaxData;
  onBack: () => void;
}

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  icon: React.ElementType;
  color: string;
}

const StatBar = ({ label, value, max = 100, icon: Icon, color }: StatBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={color} size={18} />
        <span className="text-xs md:text-sm font-bold text-zinc-300 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs md:text-sm font-black text-yellow-400/90">{value}/{max}</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-2.5 border border-white/5 overflow-hidden shadow-inner">
      <div
        className={`h-full bg-gradient-to-r ${color === 'text-yellow-400' ? 'from-yellow-500 to-yellow-200' : 'from-cyan-500 to-blue-300'} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

export const ProfileView = ({ pax, onBack }: ProfileViewProps) => {
  const stats = calculateRPGStats(pax); // Calculate RPG metrics based on PAX attendance
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 selection:bg-yellow-400/30">
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 px-4 py-2 md:px-5 md:py-2.5 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-2xl text-yellow-400 font-black text-xs md:text-sm transition-all shadow-2xl active:scale-95"
      >
        ← BACK
      </button>

      {/* Hero Section */}
      <div className={`relative pt-24 md:pt-32 pb-24 md:pb-40 bg-gradient-to-b ${classColor}`}>
        <div className="absolute inset-0 opacity-20 bg-zinc-950" />
        <div className="relative px-6 md:px-10 text-center space-y-4">
          <div className={`inline-block px-6 py-2 rounded-full border ${classBg} ${classText} font-black text-sm uppercase tracking-widest`}>
            {stats.class}
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">{pax.name}</h1>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Crown className="text-yellow-400" size={20} />
            <span className="text-2xl md:text-3xl font-black text-white">Level {stats.level}</span>
            <Crown className="text-yellow-400" size={20} />
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative mt-8 px-6 md:px-10 max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-xl shadow-2xl">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <span>Experience Progress</span>
                <span>{stats.experience}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-3 border border-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-200 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  style={{ width: `${stats.experience}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 md:px-10 -mt-12 md:-mt-24 relative z-10 max-w-4xl mx-auto space-y-6 md:space-y-10">
        {/* Core Attributes */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black italic text-white uppercase flex items-center gap-3 tracking-tighter">
              <Sword size={28} className="text-yellow-400" />
              Core Attributes
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm mt-2 font-medium leading-relaxed max-w-2xl">
              RPG metrics are calculated based on your F3 journey. <span className="text-yellow-400/80">Stamina</span> grows with total posts, <span className="text-cyan-400/80">Agility</span> increases with AO variety, and <span className="text-cyan-400/80">Leadership</span> is forged by leading the Q.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <StatBar
              label="Stamina"
              value={stats.stamina}
              max={100}
              icon={Zap}
              color="text-yellow-400"
            />
            <StatBar
              label="Agility"
              value={stats.agility}
              max={100}
              icon={TrendingUp}
              color="text-cyan-400"
            />
            <StatBar
              label="Leadership"
              value={stats.leadership}
              max={100}
              icon={Shield}
              color="text-cyan-400"
            />
          </div>
        </div>

        {/* Character Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-black italic text-yellow-400 uppercase mb-6 flex items-center gap-2">
              <Award size={20} />
              Achievements
            </h3>
            {pax.awards.length > 0 ? (
              <div className="space-y-3">
                {pax.awards.map((award) => {
                  const isShirt = award.toLowerCase().startsWith('shirt');
                  const shirtOrder = isShirt ? award.split(':')[1] : null;
                  const displayName = shirtOrder ? `Centurion #${shirtOrder}` : award;

                  return (
                    <div 
                      key={award} 
                      className={`flex items-center justify-between p-4 bg-white/5 border rounded-2xl transition-all ${
                        isShirt 
                          ? 'border-yellow-400/30 bg-yellow-400/5 shadow-[0_0_20px_rgba(250,204,21,0.05)]' 
                          : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {award.startsWith('Cindy') ? '🧱' : award.startsWith('Mug') ? '☕' : '👕'}
                        </span>
                        <div>
                          <span className="font-bold text-white capitalize block">{displayName}</span>
                          {isShirt && (
                            <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">100 Beatdowns Milestone</span>
                          )}
                        </div>
                      </div>
                      {isShirt && <Crown size={16} className="text-yellow-400 animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-500 italic">No achievements yet. Keep grinding!</p>
            )}
          </div>

          {/* Journey Stats */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-xl">
            <h3 className="text-xl font-black italic text-yellow-400 uppercase mb-6 flex items-center gap-2">
              <Calendar size={20} />
              Journey
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div>
                  <span className="text-sm text-zinc-400 uppercase font-bold block">Total Posts</span>
                  {pax.posts < 100 && !pax.awards.some(a => a.toLowerCase().startsWith('shirt')) && (
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                      {100 - pax.posts} more to the 100 Shirt
                    </span>
                  )}
                </div>
                <span className="text-2xl font-black text-yellow-400">{pax.posts}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Consistency</span>
                <span className={`text-2xl font-black ${pax.consistency > 50 ? 'text-green-400' : 'text-orange-400'}`}>
                  {pax.consistency}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">First BD</span>
                <span className="font-bold text-white">{pax.firstBD}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Last BD</span>
                <span className="font-bold text-white">{pax.lastBD}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Home AO</span>
                <span className="font-bold text-white flex items-center gap-2">
                  <MapPin size={16} />
                  {pax.homeAo}
                </span>
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

        {/* The F3 Way & AO Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl">
            <h3 className="text-xl font-black italic text-white uppercase mb-6 flex items-center gap-2">
              <Target size={20} className="text-yellow-400" />
              The F3 Mission
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              To plant, grow and serve small men’s workout groups for the <span className="text-white font-bold">invigoration of male leadership</span> in the community.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Free', 'All Men', 'Outdoors', 'Peer-led', 'Circle of Trust'].map((pillar) => (
                <span key={pillar} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          <a 
            href="https://www.instagram.com/f3northkaty_helios/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all hover:border-pink-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
            <Instagram size={40} className="text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">
              Follow Helios
            </h3>
            <p className="text-zinc-400 text-xs mt-1">@f3northkaty_helios</p>
            <div className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white/20 transition-colors">
              View Gallery
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
