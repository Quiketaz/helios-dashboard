import React from 'react';
import { getAchievementByString, getRarityColor } from '../utils/achievements';

interface AwardBadgeProps {
  award: string;
  showLabel?: boolean;
}

export const AwardBadge: React.FC<AwardBadgeProps> = ({ award, showLabel = false }) => {
  const isShirt = award.toLowerCase().startsWith('shirt');
  const shirtOrder = isShirt && award.includes(':') ? award.split(':')[1] : null;
  const def = getAchievementByString(award);
  
  // Fallback if not found
  if (!def) return null;

  const label = shirtOrder ? `Centurion #${shirtOrder}` : award;
  const colorClass = getRarityColor(def.rarity);

  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 border ${colorClass}`} title={label}>
      <def.icon size={12} strokeWidth={2.5} />
      {shirtOrder && (
        <span className="text-[9px] font-black uppercase tracking-tighter">
          #{shirtOrder}
        </span>
      )}
      {showLabel && !shirtOrder && (
        <span className="text-[10px] font-bold capitalize">{def.name}</span>
      )}
    </span>
  );
};