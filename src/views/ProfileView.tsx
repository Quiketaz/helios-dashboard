//import React from 'react';
import { Sword, Shield, Zap, Crown, Award, Calendar, MapPin, TrendingUp } from 'lucide-react';
import type { PaxData } from '../types';
import { calculateRPGStats, getClassColor, getClassBgColor, getClassTextColor } from '../utils';

interface ProfileViewProps {
  pax: PaxData;
  onBack: () => void;
}

export const ProfileView = ({ pax, onBack }: ProfileViewProps) => {
  const stats = calculateRPGStats(pax); // Placeholder for total PAX count
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

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
        <span className="text-sm md:text-base font-black text-yellow-400">{value}/{max}</span>
      </div>
      <div className="w-full bg-black/50 rounded-full h-3 border border-zinc-800 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color === 'text-yellow-400' ? 'from-yellow-500 to-yellow-300' : 'from-cyan-500 to-blue-400'} rounded-full transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-zinc-900 pb-20">
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 px-4 py-2 md:px-6 md:py-3 bg-zinc-900/90 backdrop-blur hover:bg-zinc-800 border border-zinc-800 rounded-xl text-yellow-400 font-black text-xs md:text-sm transition-all shadow-2xl"
      >
        ← BACK
      </button>

      {/* Hero Section */}
      <div className={`relative pt-24 md:pt-20 pb-24 md:pb-32 bg-gradient-to-b ${classColor}`}>
        <div className="absolute inset-0 opacity-10 bg-black" />
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
          <div className="bg-black/40 border border-zinc-800 rounded-full p-3 backdrop-blur">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <span>Experience Progress</span>
                <span>{stats.experience}%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-4 border border-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"
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
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 md:p-10 backdrop-blur">
          <h2 className="text-2xl font-black italic text-yellow-400 uppercase mb-8 flex items-center gap-3">
            <Sword size={24} />
            Core Attributes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur">
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
                      className={`flex items-center justify-between p-3 bg-black/40 border rounded-xl transition-all ${
                        isShirt 
                          ? 'border-yellow-400/50 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                          : 'border-zinc-800'
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
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur">
            <h3 className="text-xl font-black italic text-yellow-400 uppercase mb-6 flex items-center gap-2">
              <Calendar size={20} />
              Journey
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
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
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Consistency</span>
                <span className={`text-2xl font-black ${pax.consistency > 50 ? 'text-green-400' : 'text-orange-400'}`}>
                  {pax.consistency}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">First BD</span>
                <span className="font-bold text-white">{pax.firstBD}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Last BD</span>
                <span className="font-bold text-white">{pax.lastBD}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
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
        <div className={`bg-gradient-to-r ${classBg} border rounded-3xl p-6 md:p-8 backdrop-blur`}>
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
