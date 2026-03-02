import type { RPGStats, RPGClass, PaxData } from '../types';

export const calculateLevel = (posts: number): number => Math.floor(posts / 15) + 1;

/**
 * Determines RPG class based on consistency percentage
 * 80%+ = Legend (elite tier)
 * 60-79% = Commander (leadership focused)
 * 40-59% = Guardian (steady presence)
 * Below 40% = Warrior (building strength)
 */
export const determineRPGClass = (consistency: number): RPGClass => {
  if (consistency >= 80) return 'Legend';
  if (consistency >= 60) return 'Commander';
  if (consistency >= 40) return 'Guardian';
  return 'Warrior';
};

/**
 * Calculate RPG attributes from PAX data
 */
export const calculateRPGStats = (pax: PaxData): RPGStats => {
  const level = calculateLevel(pax.posts);
  const fitness = Math.min(100, (pax.posts / 250) * 100); 
  const fellowship = pax.consistency; 
  const impact = Math.min(100, (level / 10) * 100); 
  const rpgClass = determineRPGClass(pax.consistency);

  return {
    class: rpgClass,
    level,
    fitness: Math.round(fitness),
    fellowship: Math.round(fellowship),
    impact: Math.round(impact),
  };
};

/**
 * Get class-specific styling
 */
export const getClassColor = (rpgClass: RPGClass): string => {
  const colorMap: Record<RPGClass, string> = {
    Legend: 'from-purple-600 to-pink-600',
    Commander: 'from-yellow-600 to-yellow-400',
    Guardian: 'from-blue-600 to-cyan-400',
    Warrior: 'from-orange-600 to-red-500',
  };
  return colorMap[rpgClass];
};

export const getClassBgColor = (rpgClass: RPGClass): string => {
  const colorMap: Record<RPGClass, string> = {
    Legend: 'bg-purple-900/20 border-purple-500/50',
    Commander: 'bg-yellow-900/20 border-yellow-500/50',
    Guardian: 'bg-blue-900/20 border-blue-500/50',
    Warrior: 'bg-orange-900/20 border-orange-500/50',
  };
  return colorMap[rpgClass];
};

export const getClassTextColor = (rpgClass: RPGClass): string => {
  const colorMap: Record<RPGClass, string> = {
    Legend: 'text-purple-400',
    Commander: 'text-yellow-400',
    Guardian: 'text-cyan-400',
    Warrior: 'text-orange-400',
  };
  return colorMap[rpgClass];
};