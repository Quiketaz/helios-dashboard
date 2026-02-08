import Papa from 'papaparse';
import type { PaxData } from '../types';
import { parseAttendanceCSV, parsePostingsCSV } from './csvParser';

/**
 * Shared parsing logic used by both the Ingestor (for validation)
 * and the App (for displaying live data).
 */
export const processRawCSV = (csvString: string): PaxData[] => {
  let processedData: PaxData[] = [];
  
  Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    beforeFirstChunk: (chunk) => {
      // Robustly find the actual header row in case files contain
      // metadata lines at the top (many Helios CSVs start on line 4).
      const lines = chunk.split(/\r?\n/);

      const headerTokens = ['Name', 'Date', 'Q', 'Timestamp', 'BD Count', 'First BD', 'Last BD', 'Consistency'];
      let headerIndex = -1;

      for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const line = (lines[i] || '').trim();
        if (!line) continue;

        // If the line contains any common header token, treat it as header
        if (headerTokens.some(t => line.includes(t))) {
          headerIndex = i;
          break;
        }

        // Heuristic: a header usually contains letters and at least one comma
        if (/[A-Za-z]/.test(line) && line.includes(',')) {
          headerIndex = i;
          break;
        }
      }

      if (headerIndex > 0) {
        return lines.slice(headerIndex).join('\n');
      }

      // Fallback: preserve previous behavior for legacy roster files
      if (lines[0] && lines[0].includes('Not attended')) {
        lines.shift();
      }

      return lines.join('\n');
    },
    complete: (results) => {
      processedData = results.data.map((row: any) => {
        const name = row['Name'];
        if (!name || name.trim() === "") return null;
        
        return {
          name: name.trim(),
          posts: parseInt(row['BD Count '] || row['BD Count']) || 0,
          consistency: parseInt(row['Consistency']?.replace('%', '')) || 0,
          firstBD: row['First BD'] || 'N/A',
          lastBD: row['Last BD'] || 'N/A',
          homeAo: row['Home AO or Visitor'] || 'Helios',
          awards: [
            row['Cindy'] === 'X' ? 'Cindy' : '',
            row['Mug'] === 'X' ? 'Mug' : '',
            row['Shirt'] === 'X' || row['Shirt'] === '1' ? 'Shirt' : ''
          ].filter(Boolean)
        };
      }).filter((p): p is PaxData => p !== null);
    }
  });

  return processedData;
};

export const fetchPaxRoster = async (): Promise<PaxData[]> => {
  const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
  // Prefer explicit postings GID, fall back to legacy GID
  const GID = import.meta.env.VITE_HELIOS_POSTINGS_GID || import.meta.env.VITE_HELIOS_GID;
  const URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

  const response = await fetch(URL);
  if (!response.ok) throw new Error("Failed to reach Google Sheets");
  const text = await response.text();
  
  // Apply unified parsing and sort by posts
  return processRawCSV(text).sort((a, b) => b.posts - a.posts);
};

/**
 * Fetch a local CSV file from the public/data folder
 */
export const fetchLocalCSV = async (filename: string): Promise<string> => {
  // Encode the filename to handle spaces and special characters
  const encoded = encodeURIComponent(filename);
  const response = await fetch(`/data/${encoded}`);
  if (!response.ok) throw new Error(`Failed to load local CSV: ${filename} (request to /data/${encoded} returned ${response.status})`);
  return response.text();
};

/**
 * Load PAX data from a local CSV file
 */
export const loadLocalPaxData = async (filename: string): Promise<PaxData[]> => {
  const csvText = await fetchLocalCSV(filename);
  return processRawCSV(csvText).sort((a, b) => b.posts - a.posts);
};

/**
 * Generic fetch helper for a sheet GID
 */
export const fetchCSVByGid = async (gid: string): Promise<string> => {
  const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
  const URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Failed to fetch sheet gid=${gid}`);
  return res.text();
};

export const fetchAttendanceData = async () => {
  const gid = import.meta.env.VITE_HELIOS_ATTENDANCE_GID;
  if (!gid) throw new Error('VITE_HELIOS_ATTENDANCE_GID not set');
  const csv = await fetchCSVByGid(gid);
  return parseAttendanceCSV(csv);
};

export const fetchPostingsData = async () => {
  const gid = import.meta.env.VITE_HELIOS_POSTINGS_GID || import.meta.env.VITE_HELIOS_GID;
  if (!gid) throw new Error('VITE_HELIOS_POSTINGS_GID not set');
  const csv = await fetchCSVByGid(gid);
  return parsePostingsCSV(csv);
};