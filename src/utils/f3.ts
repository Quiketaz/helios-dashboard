/**
 * F3 Domain Logic
 * Centralizes logic for awards, lingo, and specific calculations.
 */

export const getAwardIcon = (award: string): string => {
  if (award.startsWith('Cindy')) return '🧱';
  if (award.startsWith('Mug')) return '☕';
  if (award.startsWith('Headband')) return '🤕';
  return '👕';
};

export const getAwardLabel = (award: string): string | null => {
  return award.includes(':') ? award.split(':')[1] : null;
};
