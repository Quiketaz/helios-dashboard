import Papa from 'papaparse';
import type { PaxData, QRecord } from '../types';

/**
 * Analytics data from Q Posting Counts sheet
 */
export interface QPostingAnalytics {
  name: string;
  qCount: number;
  recentQs: string[];
  lastQ: string;
  consistency: number;
}

/**
 * Attendance record from Attendance sheet
 */
export interface AttendanceRecord {
  date: string;
  name: string;
  bdCount: number;
  ddCount: number;
  qLead?: string;
  isQ: boolean;
  location: string;
  type: string;
}

/**
 * Detect CSV type by headers
 */
export const detectCSVType = (csvText: string): 'roster' | 'attendance' | 'postings' | 'unknown' => {
  const firstLine = csvText.split('\n')[0].toLowerCase();
  
  if (firstLine.includes('bd count') && firstLine.includes('consistency')) {
    return 'roster';
  }
  if (firstLine.includes('year') && firstLine.includes('name') && firstLine.includes('bd')) {
    return 'attendance';
  }
  if (firstLine.includes('q name') && firstLine.includes('posting')) {
    return 'postings';
  }
  
  return 'unknown';
};

/**
 * Parse Attendance CSV format
 */
export const parseAttendanceCSV = (csvText: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      results.data.forEach((row: any) => {
        const date = row['Date'];
        const name = row['Name'];
        
        if (date && name && date.trim() && name.trim()) {
          records.push({
            date: date.trim(),
            name: name.trim(),
            bdCount: parseInt(row['BD Count'] || row['BD Count '] || '0') || 0,
            ddCount: parseInt(row['DD Count'] || '0') || 0,
            qLead: row['BD'] || row['Q'] || undefined,
            isQ: (row['Pax Comment'] || '').includes('Q') || row['BD'] === '1',
            location: row['Location Comment'] || row['Home AO or Visitor'] || 'TBD',
            type: row['BD Type'] || 'Standard',
          });
        }
      });
    },
  });
  
  return records;
};

/**
 * Parse Q Posting Counts CSV format
 */
export const parsePostingsCSV = (csvText: string): QPostingAnalytics[] => {
  const analytics: QPostingAnalytics[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const grouped: Record<string, any> = {};
      
      results.data.forEach((row: any) => {
        const qName = row['Q Name'] || row['Q'];
        if (!qName || !qName.trim()) return;
        
        const name = qName.trim();
        if (!grouped[name]) {
          grouped[name] = {
            name,
            qCount: 0,
            recentQs: [],
            dates: [],
          };
        }
        
        grouped[name].qCount++;
        if (row['Date']) {
          grouped[name].dates.push(row['Date']);
          grouped[name].recentQs.push(row['Date']);
        }
      });
      
      // Convert to final format
      Object.values(grouped).forEach((item: any) => {
        analytics.push({
          name: item.name,
          qCount: item.qCount,
          recentQs: item.recentQs.slice(-5), // Last 5 Qs
          lastQ: item.recentQs[item.recentQs.length - 1] || 'N/A',
          consistency: Math.round((item.qCount / (365 / 52)) * 100), // Rough consistency estimate
        });
      });
    },
  });
  
  return analytics.sort((a, b) => b.qCount - a.qCount);
};

/**
 * Extract summary statistics from attendance data
 */
export const getAttendanceStats = (records: AttendanceRecord[]) => {
  const stats = {
    totalRecords: records.length,
    uniquePax: new Set(records.map(r => r.name)).size,
    totalBDs: records.reduce((sum, r) => sum + r.bdCount, 0),
    totalDDs: records.reduce((sum, r) => sum + r.ddCount, 0),
    uniqueQs: new Set(records.filter(r => r.isQ).map(r => r.name)).size,
    dateRange: {
      earliest: records.length > 0 ? records[0].date : 'N/A',
      latest: records.length > 0 ? records[records.length - 1].date : 'N/A',
    },
  };
  
  return stats;
};

/**
 * Extract summary from Q posting analytics
 */
export const getPostingStats = (analytics: QPostingAnalytics[]) => {
  return {
    totalQs: analytics.reduce((sum, a) => sum + a.qCount, 0),
    topQs: analytics.slice(0, 5),
    averageQsPerLeader: Math.round(analytics.reduce((sum, a) => sum + a.qCount, 0) / analytics.length),
  };
};
