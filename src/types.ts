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

export type TabType = 'DASHBOARD' | 'ROSTER' | 'SCHEDULE' | 'STATS' | 'ADMIN';