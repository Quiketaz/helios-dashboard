import Papa from 'papaparse';

/**
 * Validation result for parsed data
 */
export interface ValidationResult {
  rowsProcessed: number;
  rowsWithIssues: number;
  issues: Array<{ row: number; field: string; issue: string }>;
  missingHeaders: string[];
  isDuplicate: boolean;
}

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
 * Q Schedule record from Q Sheet tab
 */
export interface QScheduleRecord {
  month: string;
  day: string;
  date: string;
  time: string;
  type: string;
  qLead: string;
  notes: string;
}

/**
 * Detect CSV type by headers (searches through first 10 lines)
 */
export const detectCSVType = (csvText: string): 'roster' | 'attendance' | 'postings' | 'qschedule' | 'unknown' => {
  const lines = csvText.split('\n');
  
  // Search through first 10 lines for a header row that matches known patterns
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = (lines[i] || '').toLowerCase().trim();
    if (!line) continue;
    
    // Q Schedule: has Date, Time, Type, Q columns (with or without Month/Day)
    if ((line.includes('month') && line.includes('day') && line.includes('date') && 
        line.includes('time') && line.includes('type') && line.includes('q') &&
        !line.includes('bd count')) ||
        (line.includes('date') && line.includes('time') && line.includes('type') && 
        line.includes('q') && line.includes('notes') && !line.includes('bd') && !line.includes('year'))) {
      return 'qschedule';
    }
    
    // Roster: has BD Count and Consistency
    if (line.includes('bd count') && line.includes('consistency')) {
      return 'roster';
    }
    
    // Attendance: has Year, Month, Name, BD
    if (line.includes('year') && line.includes('name') && line.includes('bd') &&
        !line.includes('consistency')) {
      return 'attendance';
    }
    
    // Postings: has Q Name and Posting
    if (line.includes('q name') && line.includes('posting')) {
      return 'postings';
    }
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
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      results.data.forEach((row) => {
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

interface GroupedPosting {
  name: string;
  qCount: number;
  recentQs: string[];
  dates: string[];
}

/**
 * Parse Q Posting Counts CSV format
 */
export const parsePostingsCSV = (csvText: string): QPostingAnalytics[] => {
  const analytics: QPostingAnalytics[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      const grouped: Record<string, GroupedPosting> = {};
      
      results.data.forEach((row) => {
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
      Object.values(grouped).forEach((item) => {
        analytics.push({
          name: item.name,
          qCount: item.qCount,
          recentQs: item.recentQs.slice(-5), // Last 5 Qs
          lastQ: item.recentQs[item.recentQs.length - 1] || 'N/A',
          consistency: Math.min(100, Math.round((item.qCount / (365 / 52)) * 100)), // Cap at 100%
        });
      });
    },
  });
  
  return analytics.sort((a, b) => b.qCount - a.qCount);
};

/**
 * Parse Q Schedule CSV format
 */
export const parseQScheduleCSV = (csvText: string): QScheduleRecord[] => {
  const records: QScheduleRecord[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      results.data.forEach((row) => {
        const date = row['Date'];
        const month = row['Month'];
        
        if (date && date.trim()) {
          records.push({
            month: (month || '').trim(),
            day: (row['Day'] || '').trim(),
            date: date.trim(),
            time: (row['Time'] || '').trim(),
            type: (row['Type'] || '').trim(),
            qLead: (row['Q'] || '').trim(),
            notes: (row['Notes'] || '').trim(),
          });
        }
      });
    },
  });
  
  return records;
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
    averageQsPerLeader: analytics.length > 0 ? Math.round(analytics.reduce((sum, a) => sum + a.qCount, 0) / analytics.length) : 0,
  };
};

/**
 * Validate attendance CSV headers and data quality
 */
export const validateAttendanceCSV = (csvText: string): ValidationResult => {
  const result: ValidationResult = {
    rowsProcessed: 0,
    rowsWithIssues: 0,
    issues: [],
    missingHeaders: [],
    isDuplicate: false,
  };

  const requiredHeaders = ['Date', 'Name', 'BD'];
  let headerRow: string[] = [];

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      if (results.meta?.fields) {
        headerRow = results.meta.fields;
        // Check for duplicate headers
        const headerSet = new Set<string>();
        for (const h of headerRow) {
          if (!h || !h.trim()) continue;
          if (headerSet.has(h)) {
            result.isDuplicate = true;
          }
          headerSet.add(h);
        }

        // Check for missing required headers
        for (const req of requiredHeaders) {
          if (!headerRow.some(h => h && h.includes(req))) {
            result.missingHeaders.push(req);
          }
        }
      }

      // Validate data rows
      results.data.forEach((row, idx) => {
        const date = row['Date'];
        const name = row['Name'];
        let rowHasIssue = false;

        if (date && name && date.trim() && name.trim()) {
          result.rowsProcessed++;
        }

        if (!date || !date.trim()) {
          result.issues.push({ row: idx + 2, field: 'Date', issue: 'Missing or empty date' });
          rowHasIssue = true;
        }
        if (!name || !name.trim()) {
          result.issues.push({ row: idx + 2, field: 'Name', issue: 'Missing or empty name' });
          rowHasIssue = true;
        }

        const bdCount = row['BD Count'] || row['BD Count '] || '0';
        if (bdCount && isNaN(parseInt(bdCount))) {
          result.issues.push({ row: idx + 2, field: 'BD Count', issue: `Non-numeric value: "${bdCount}"` });
          rowHasIssue = true;
        }

        if (rowHasIssue) result.rowsWithIssues++;
      });
    },
  });

  return result;
};

/**
 * Validate postings CSV headers and data quality
 */
export const validatePostingsCSV = (csvText: string): ValidationResult => {
  const result: ValidationResult = {
    rowsProcessed: 0,
    rowsWithIssues: 0,
    issues: [],
    missingHeaders: [],
    isDuplicate: false,
  };

  let headerRow: string[] = [];

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      if (results.meta?.fields) {
        headerRow = results.meta.fields;
        const headerSet = new Set<string>();
        for (const h of headerRow) {
          if (!h || !h.trim()) continue;
          if (headerSet.has(h)) {
            result.isDuplicate = true;
          }
          headerSet.add(h);
        }

        const hasQName = headerRow.some(h => h && (h.includes('Q Name') || h.includes('Q')));
        if (!hasQName) {
          result.missingHeaders.push('Q Name or Q');
        }
      }

      results.data.forEach((row, idx) => {
        const qName = row['Q Name'] || row['Q'];
        if (qName && qName.trim()) {
          result.rowsProcessed++;
        } else {
          result.issues.push({ row: idx + 2, field: 'Q Name', issue: 'Missing or empty Q name' });
          result.rowsWithIssues++;
        }
      });
    },
  });

  return result;
};

/**
 * Validate Q Schedule CSV headers and data quality
 */
export const validateQScheduleCSV = (csvText: string): ValidationResult => {
  const result: ValidationResult = {
    rowsProcessed: 0,
    rowsWithIssues: 0,
    issues: [],
    missingHeaders: [],
    isDuplicate: false,
  };

  const requiredHeaders = ['Date', 'Time', 'Type'];
  let headerRow: string[] = [];

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results: Papa.ParseResult<Record<string, string>>) => {
      if (results.meta?.fields) {
        headerRow = results.meta.fields;
        const headerSet = new Set<string>();
        for (const h of headerRow) {
          if (!h || !h.trim()) continue;
          if (headerSet.has(h)) {
            result.isDuplicate = true;
          }
          headerSet.add(h);
        }

        // Check for required headers
        for (const req of requiredHeaders) {
          if (!headerRow.some(h => h && h.includes(req))) {
            result.missingHeaders.push(req);
          }
        }
      }

      results.data.forEach((row, idx) => {
        const date = row['Date'];
        let rowHasIssue = false;

        if (date && date.trim()) {
          result.rowsProcessed++;
        }

        if (!date || !date.trim()) {
          result.issues.push({ row: idx + 2, field: 'Date', issue: 'Missing or empty date' });
          rowHasIssue = true;
        }

        const time = row['Time'];
        if (!time || !time.trim()) {
          result.issues.push({ row: idx + 2, field: 'Time', issue: 'Missing or empty time' });
          rowHasIssue = true;
        }

        if (rowHasIssue) result.rowsWithIssues++;
      });
    },
  });

  return result;
};

/**
 * Extract stats from Q Schedule records
 */
export const getQScheduleStats = (records: QScheduleRecord[]) => {
  const uniqueQLeads = new Set(records.filter(r => r.qLead).map(r => r.qLead));
  const typeCount: Record<string, number> = {};
  records.forEach(r => {
    typeCount[r.type] = (typeCount[r.type] || 0) + 1;
  });

  return {
    totalEvents: records.length,
    uniqueQLeads: uniqueQLeads.size,
    eventTypes: Object.entries(typeCount).map(([type, count]) => ({ type, count })),
    earliestDate: records.length > 0 ? records[0].date : 'N/A',
    latestDate: records.length > 0 ? records[records.length - 1].date : 'N/A',
  };
};
