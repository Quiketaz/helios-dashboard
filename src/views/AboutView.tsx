import { Target, Shield, Users, Zap, Heart, Instagram, Info, Globe } from 'lucide-react';

export const AboutView = () => {
  const pillars = [
    { title: 'Free', desc: 'Always free of charge', icon: Zap },
    { title: 'All Men', desc: 'Open to all men', icon: Users },
    { title: 'Outdoors', desc: 'Held outdoors, rain or shine', icon: Globe },
    { title: 'Peer-led', desc: 'Rotating leadership', icon: Shield },
    { title: 'COT', desc: 'Ends with a Circle of Trust', icon: Heart },
  ];

  const threeFs = [
    { name: 'Fitness', desc: 'The magnet that pulls us together.' },
    { name: 'Fellowship', desc: 'The glue that keeps us together.' },
    { name: 'Faith', desc: 'The belief in something bigger than ourselves.' },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Mission Hero */}
      <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none rotate-12">
          <Target size={240} />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
              <Target className="text-yellow-400" size={24} />
            </div>
            <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em]">The Mission</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase leading-tight tracking-tighter">
            To plant, grow and serve small workout groups for men for the <span className="text-yellow-400">invigoration of male community leadership.</span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* The 5 Pillars */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] px-2">The 5 Pillars</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center group hover:bg-white/[0.06] transition-all">
                <pillar.icon size={20} className="text-yellow-400/70 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black text-white uppercase mb-1">{pillar.title}</span>
                <span className="text-[10px] text-zinc-500 font-bold leading-tight">{pillar.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Connect</h3>
          <a 
            href="https://www.instagram.com/f3northkaty_helios/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-white/10 rounded-[2rem] group hover:border-pink-500/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-pink-500/20 transition-colors">
                <Instagram className="text-pink-500" size={24} />
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-tight">Helios Instagram</div>
                <div className="text-[10px] text-zinc-500 font-bold">@f3northkaty_helios</div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Globe size={14} className="text-zinc-400" />
            </div>
          </a>
        </div>
      </div>

      {/* The 3 Fs */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] px-2">The Three Fs</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {threeFs.map((f) => (
            <div key={f.name} className="relative overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.05] transition-all">
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Info size={80} />
              </div>
              <h4 className="text-lg font-black italic text-yellow-400 uppercase mb-2 tracking-tight">{f.name}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-8 text-center">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">F3 North Katy • Helios AO</p>
      </div>
    </div>
  );
};