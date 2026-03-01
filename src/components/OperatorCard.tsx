import React from 'react';
import { Logo } from './Logo';

interface OperatorCardProps {
  name: string;
  operatorId: string;
  shieldStrength: number;
  rank: string;
}

export const OperatorCard: React.FC<OperatorCardProps> = ({
  name,
  operatorId,
  shieldStrength,
  rank,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface-container-high p-6 shadow-md transition-all hover:shadow-lg">
      {/* Watermark Logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
        <Logo size="xl" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
              Operator Identity
            </p>
            <h2 className="mt-1 text-2xl font-bold text-primary">
              {name}
            </h2>
            <p className="text-sm font-mono text-on-surface-variant">
              ID: {operatorId}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-sm">
            <span className="text-xs font-bold text-on-primary">{rank}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4 border border-outline-variant/30">
          <div className="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              <path d="M12.53 10.28a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06L12 8.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium uppercase">Shield Strength</span>
            <span className="text-xl font-black text-primary">
              {shieldStrength}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};