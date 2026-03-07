import { useMemo } from 'react';
import type { PaxData } from '../types';

/**
 * Pure function to apply dynamic achievement logic (e.g. Headband for 250+ posts)
 * to a PAX record if not already present.
 */
export const applyDynamicAchievements = (pax: PaxData): PaxData => {
  // Check for Headband (250 posts)
  // Using toLowerCase() for case-insensitive check
  const hasHeadband = pax.awards.some(a => a.toLowerCase().startsWith('headband'));
  
  if (pax.posts >= 250 && !hasHeadband) {
    return {
      ...pax,
      awards: [...pax.awards, 'Headband']
    };
  }
  
  return pax;
};

/**
 * Hook to memoize the application of dynamic achievements for a single PAX.
 */
export const usePaxAchievements = (pax: PaxData | null) => {
  return useMemo(() => (pax ? applyDynamicAchievements(pax) : null), [pax]);
};