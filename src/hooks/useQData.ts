import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import type { QRecord } from '../types';

export const useQData = () => {
  const [qList, setQList] = useState<QRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQData = async () => {
      try {
        setLoading(true);
        // URL to the upcoming workouts sheet
        const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
        const Q_GID = import.meta.env.VITE_HELIOS_Q_GID || '649963747'; // Default GID for Q schedule
        const URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${Q_GID}&single=true&output=csv`;

        const res = await fetch(URL);
        const text = await res.text();

        const qData: QRecord[] = [];
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<Record<string, string>>) => {
            results.data.forEach((row) => {
              // Parse the CSV row - handle various column name possibilities
              const date = row['Date'] || row['date'] || '';
              const day = row['Day'] || row['day'] || '';
              const time = row['Time'] || row['time'] || '';
              const type = row['Type'] || row['type'] || row['Workout Type'] || '';
              const q = row['Q'] || row['Pax Q'] || row['Q Name'] || '';
              const notes = row['Notes'] || row['Location'] || row['AO'] || '';

              if (date && date.trim()) {
                qData.push({
                  date: date.trim(),
                  day: day.trim() || getDay(date),
                  time: time.trim(),
                  type: type.trim(),
                  q: q.trim(),
                  notes: notes.trim(),
                });
              }
            });
            setQList(qData);
            setError(null);
          },
          error: () => {
            setError('Failed to parse Q schedule');
            setQList([]);
          },
        });
      } catch (err) {
        console.error('Error fetching Q data:', err);
        setError('Failed to fetch Q schedule');
        setQList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQData();
  }, []);

  return { qList, loading, error };
};

/**
 * Extract day name from date string if not provided
 */
const getDay = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return '';
  }
};
