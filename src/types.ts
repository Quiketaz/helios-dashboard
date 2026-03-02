export interface PaxData {
  name: string;
  posts: number;
  consistency: number;
  firstBD: string;
  lastBD: string;
  homeAo: string;
  awards: string[];
}

export interface QRecord {
  date: string;
  day: string;
  time: string;
  type: string;
  q: string;
  notes: string;
}

export type RPGClass = 'Warrior' | 'Commander' | 'Guardian' | 'Legend';

export interface RPGStats {
  class: RPGClass;
  level: number;
  fitness: number;
  fellowship: number;
  impact: number;
}

export type TabType = 'DASHBOARD' | 'ROSTER' | 'SCHEDULE' | 'STATS' | 'ADMIN' | 'PROFILE' | 'ABOUT';