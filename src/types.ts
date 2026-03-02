export interface AttendanceRecord {
  date: string;
  name: string;
  bdCount: number;
  ddCount: number;
  qLead?: string;
  isQ: boolean;
  isVQ: boolean;
  isFNG: boolean;
  isPP: boolean;
  isBB: boolean;
  isStarsky: boolean;
  isSecondHelping: boolean;
  location: string;
  type: string;
}

export interface PaxData {
  name: string;
  posts: number;
  consistency: number;
  firstBD: string;
  lastBD: string;
  homeAo: string;
  awards: string[];
  attendance?: AttendanceRecord[];
  qCount?: number;
  vqCount?: number;
  fngCount?: number;
  ppCount?: number;
  bbCount?: number;
  starskyCount?: number;
  secondHelpingCount?: number;
  vqDate?: string;
  fngDate?: string;
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

export type TabType = 'DASHBOARD' | 'ROSTER' | 'SCHEDULE' | 'STATS' | 'ADMIN' | 'ABOUT' |  'PROFILE' | 'SETTINGS'
