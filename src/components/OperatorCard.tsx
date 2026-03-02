import React from 'react';
import { Logo } from './Logo';
import { Zap, Calendar, Award } from 'lucide-react';
import type { PaxData } from '../types';
import { determineRPGClass, getClassBgColor, getClassTextColor } from '../utils/utils';

export const PaxSpotlight: React.FC<{ pax: PaxData | null }> = ({ pax }) => {
  if (!pax) return null;

  const rank = determineRPGClass(pax.consistency);
  const classBg = getClassBgColor(rank);
  const classText = getClassTextColor(rank);

  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-surface-container-high p-5 shadow-md transition-all hover:shadow-lg flex items-center justify-between gap-4">
      {/* Watermark Logo - Tucked into the corner */}
      <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.03]">
        <Logo size="lg" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Award size={14} className="text-primary" />
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
            Spotlight
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
            {pax.name}
          </h2>
          <div className={`mt-1 inline-flex px-2 py-0.5 rounded-full border ${classBg} ${classText} font-bold text-[9px] uppercase tracking-widest`}>
            {rank}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 bg-surface-container-highest px-2 py-1 rounded-lg border border-outline-variant/10">
          <Calendar size={12} className="text-primary" />
          <span className="text-[11px] font-bold text-on-surface">{pax.firstBD}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
          <Zap size={12} fill="currentColor" className="text-primary" />
          <span className="text-sm font-black text-primary">{pax.posts}</span>
        </div>
      </div>
    </div>
  );
};