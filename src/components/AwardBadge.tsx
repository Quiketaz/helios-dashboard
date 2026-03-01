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
    <span className="flex items-center gap-1 rounded-full bg-primary-container px-2 py-0.5" title={label}>
      <span className="text-xs">{emoji}</span>
      {shirtOrder && (
        <span className="text-[9px] font-black text-on-primary-container uppercase tracking-tighter">
          #{shirtOrder}
        </span>
      )}
      {showLabel && !shirtOrder && (
        <span className="text-[10px] font-bold text-on-primary-container capitalize">{award}</span>
      )}
    </span>
  );
};