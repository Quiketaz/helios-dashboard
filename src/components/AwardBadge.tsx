import React from 'react';

interface AwardBadgeProps {
  award: string;
  showLabel?: boolean;
}

export const AwardBadge: React.FC<AwardBadgeProps> = ({ award, showLabel = false }) => {
  const isShirt = award.toLowerCase().startsWith('shirt');
  const shirtOrder = isShirt && award.includes(':') ? award.split(':')[1] : null;
  
  const emoji = award.startsWith('Cindy') ? '🧱' : award.startsWith('Mug') ? '☕' : '👕';
  const label = shirtOrder ? `Centurion #${shirtOrder}` : award;

  return (
    <span className="flex items-center gap-1" title={label}>
      <span className="text-base">{emoji}</span>
      {shirtOrder && (
        <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md border border-yellow-500/30">
          #{shirtOrder}
        </span>
      )}
      {showLabel && !shirtOrder && (
        <span className="font-bold text-white capitalize">{award}</span>
      )}
    </span>
  );
};