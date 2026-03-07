import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Image as ImageIcon, Shield, Zap, TrendingUp } from 'lucide-react';

import { RadialAttribute } from './RadialAttribute';
import { calculateRPGStats } from '../utils/f3Logic';
import { getClassColor, getClassBgColor, getClassTextColor } from '../utils/utils';
import { Logo } from './Logo';
import type { PaxData } from '../types';
import { ACHIEVEMENTS } from '../utils/achievements';

// --- Internal Card Component ---
const ShareableCard = ({ pax }: { pax: PaxData }) => {
  const stats = calculateRPGStats(pax);
  const classColor = getClassColor(stats.class);
  const classBg = getClassBgColor(stats.class);
  const classText = getClassTextColor(stats.class);

  const displayedAwards = ACHIEVEMENTS.filter(def => 
    pax.awards.some(a => a.toLowerCase().startsWith(def.id))
  ).slice(0, 4);

  return (
    <div className={`w-[400px] bg-gradient-to-b ${classColor} p-1 rounded-3xl shadow-2xl`}>
      <div className="bg-surface rounded-[1.4rem] p-6 text-on-surface">
        {/* Header */}
        <div className="text-center mb-4">
          <div className={`inline-block px-3 py-1 rounded-full border ${classBg} ${classText} font-black text-[10px] uppercase tracking-widest`}>
            {stats.class}
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-2">{pax.name}</h1>
          <div className="flex items-center justify-center gap-2 text-primary mt-1">
            <Zap size={16} fill="currentColor" />
            <span className="text-xl font-black uppercase tracking-tight">{pax.posts} Posts</span>
          </div>
        </div>

        {/* Core Attributes */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <RadialAttribute label="Fitness" value={stats.fitness} max={100} icon={Zap} />
          <RadialAttribute label="Fellowship" value={stats.fellowship} max={100} icon={TrendingUp} />
          <RadialAttribute label="Impact" value={stats.impact} max={100} icon={Shield} />
        </div>

        {/* Achievements */}
        {displayedAwards.length > 0 && (
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-3">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center mb-2">Top Achievements</h3>
            <div className="flex justify-center gap-3">
              {displayedAwards.map((award) => (
                <div key={award.id} className="flex flex-col items-center" title={award.name}>
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-xl shadow-inner">
                    <award.icon size={20} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <Logo size="xs" />
          <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider">F3 Helios Dashboard</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Exported Modal Component ---
interface ShareProfileProps {
  pax: PaxData;
  onClose: () => void;
}

export const ShareProfile = ({ pax, onClose }: ShareProfileProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (cardRef.current === null) return;

    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: 'transparent' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `f3-helios-${pax.name.toLowerCase().replace(/\s/g, '-')}-profile.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to generate image', err);
        alert('Sorry, could not generate the image. Please try again.');
      });
  }, [pax.name]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative bg-surface-container-high border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="text-primary" size={24} />
          <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">Share Profile Card</h2>
        </div>

        <div className="flex justify-center my-8" ref={cardRef}>
          <ShareableCard pax={pax} />
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
        >
          <Download size={20} />
          Download Image
        </button>
      </div>
    </div>
  );
};