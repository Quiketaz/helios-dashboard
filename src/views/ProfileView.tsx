import React from 'react';
import { Sword, Shield, Zap, Crown, Award, Calendar, MapPin, TrendingUp } from 'lucide-react';
import type { PaxData } from '../types';
import { calculateRPGStats, getClassColor, getClassBgColor, getClassTextColor } from '../utils';

interface ProfileViewProps {
  pax: PaxData;
  onBack: () => void;
}

export const ProfileView = ({ pax, onBack }: ProfileViewProps) => {
  const stats = calculateRPGStats(pax, 100); // Placeholder for total PAX count
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

  const StatBar = ({ label, value, max = 100, icon: Icon, color }: any) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={color} size={18} />
          <span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">{label}</span>
        </div>
        <span className="font-black text-yellow-400">{value}/{max}</span>
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
        className="fixed top-6 left-6 z-40 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-yellow-400 font-black text-sm transition-all"
      >
        ← BACK
      </button>

      {/* Hero Section */}
      <div className={`relative pt-20 pb-32 bg-gradient-to-b ${classColor}`}>
        <div className="absolute inset-0 opacity-10 bg-black" />
        <div className="relative px-10 text-center space-y-4">
          <div className={`inline-block px-6 py-2 rounded-full border ${classBg} ${classText} font-black text-sm uppercase tracking-widest`}>
            {stats.class}
          </div>
          <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">{pax.name}</h1>
          <div className="flex items-center justify-center gap-4">
            <Crown className="text-yellow-400" size={28} />
            <span className="text-3xl font-black text-white">Level {stats.level}</span>
            <Crown className="text-yellow-400" size={28} />
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative mt-8 px-10 max-w-2xl mx-auto">
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
      <div className="px-10 -mt-24 relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Core Attributes */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 backdrop-blur">
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
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur">
            <h3 className="text-xl font-black italic text-yellow-400 uppercase mb-6 flex items-center gap-2">
              <Award size={20} />
              Achievements
            </h3>
            {pax.awards.length > 0 ? (
              <div className="space-y-3">
                {pax.awards.map((award) => (
                  <div key={award} className="flex items-center gap-3 p-3 bg-black/40 border border-zinc-800 rounded-xl">
                    <span className="text-2xl">
                      {award === 'Cindy' ? '🧱' : award === 'Mug' ? '☕' : '👕'}
                    </span>
                    <span className="font-bold text-white capitalize">{award}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 italic">No achievements yet. Keep grinding!</p>
            )}
          </div>

          {/* Journey Stats */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur">
            <h3 className="text-xl font-black italic text-yellow-400 uppercase mb-6 flex items-center gap-2">
              <Calendar size={20} />
              Journey
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/40 border border-zinc-800 rounded-xl">
                <span className="text-sm text-zinc-400 uppercase font-bold">Total Posts</span>
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
        <div className={`bg-gradient-to-r ${classBg} border rounded-3xl p-8 backdrop-blur`}>
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
