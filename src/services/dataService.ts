import Papa from 'papaparse';
import type { PaxData } from '../types';

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
      // Skip the metadata row "Not attended in past 2 weeks..."
      const lines = chunk.split(/\r?\n/);
      if (lines[0] && lines[0].includes("Not attended")) {
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
  const GID = import.meta.env.VITE_HELIOS_GID;
  const URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

  const response = await fetch(URL);
  if (!response.ok) throw new Error("Failed to reach Google Sheets");
  const text = await response.text();
  
  // Apply unified parsing and sort by posts
  return processRawCSV(text).sort((a, b) => b.posts - a.posts);
};