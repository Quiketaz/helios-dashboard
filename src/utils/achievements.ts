import { BrickWall, Coffee, Shield, Skull, Mountain, Swords, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AchievementDef {
  id: string;
  name: string;
  icon: LucideIcon;
  criteria: string;
  description?: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  target?: number; // For progress tracking
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'cindy',
    name: 'The Cindy',
    icon: BrickWall,
    criteria: '10 Posts',
    description: 'Named after the benchmark WOD. Reaching 10 posts signifies you have built the habit and are locked in.',
    rarity: 'Common',
    target: 10
  },
  {
    id: 'mug',
    name: 'The Mug',
    icon: Coffee,
    criteria: '75 Posts',
    description: 'A pillar of the community. 75 posts demonstrates consistency and dedication to the gloom.',
    rarity: 'Uncommon',
    target: 75
  },
  {
    id: 'shirt',
    name: 'Centurion',
    icon: Shield,
    criteria: '100 Posts',
    description: 'The elite. 100 posts. You have achieved the century mark.',
    rarity: 'Rare',
    target: 100
  },
  {
    id: 'headband',
    name: 'The Headband',
    icon: Skull,
    criteria: '250 Posts',
    description: 'You have earned your stripes. A Headband marks the transition from participant to committed leader.',
    rarity: 'Legendary',
    target: 250
  }
];

export const SPECIALTY_MISSIONS: AchievementDef[] = [
  { id: 'csaup', name: 'CSAUP', criteria: 'Event', description: 'Completed a Completely Stupid And Utterly Pointless event.', icon: Mountain, rarity: 'Epic' },
  { id: 'ironpax', name: 'Iron Pax', criteria: 'Challenge', description: 'Participated in the annual Iron Pax Challenge.', icon: Swords, rarity: 'Legendary' },
  { id: 'qsource', name: 'Q Source', criteria: 'Leadership', description: 'Attended Q Source leadership development training.', icon: Brain, rarity: 'Rare' }
];

export const getAchievementByString = (awardString: string): AchievementDef | undefined => {
  const normalized = awardString.toLowerCase();
  return ACHIEVEMENTS.find(a => normalized.startsWith(a.id));
};

export const getRarityColor = (rarity: string) => {
    // Helper for consistent colors across app
    if (rarity === 'Legendary') return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (rarity === 'Epic') return 'text-purple-400 border-purple-400/20 bg-purple-400/10';
    if (rarity === 'Rare') return 'text-primary border-primary/20 bg-primary/10';
    if (rarity === 'Uncommon') return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
    return 'text-on-surface-variant border-outline-variant/20 bg-surface-container-highest/50';
};