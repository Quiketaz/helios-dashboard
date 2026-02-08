import type { RPGStats, RPGClass, PaxData } from './types';

export const calculateLevel = (posts: number): number => Math.floor(posts / 15) + 1;
export const getXPProgress = (posts: number): number => ((posts % 15) / 15) * 100;

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
export const calculateRPGStats = (pax: PaxData, totalPaxCount: number): RPGStats => {
  const level = calculateLevel(pax.posts);
  const stamina = Math.min(100, (pax.posts / 250) * 100); // Normalize to 0-100 based on typical max posts
  const agility = pax.consistency; // Consistency is directly Agility
  const leadership = Math.min(100, (level / 10) * 100); // Derived from level progression
  const experience = (pax.posts % 15) * 100; // XP within current level
  const rpgClass = determineRPGClass(pax.consistency);

  return {
    class: rpgClass,
    level,
    stamina: Math.round(stamina),
    leadership: Math.round(leadership),
    agility: Math.round(agility),
    experience: Math.round(experience),
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