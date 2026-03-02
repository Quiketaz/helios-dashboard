import { useState, useEffect } from 'react';
import type { PaxData } from '../types';
import { fetchPaxRoster, fetchAttendanceData } from '../services/dataService';

export const usePaxData = () => {
  const [paxList, setPaxList] = useState<PaxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roster, attendance] = await Promise.all([
          fetchPaxRoster(),
          fetchAttendanceData()
        ]);

        const mergedData = roster.map(pax => {
          const paxAttendance = attendance.filter(
            a => a.name.toLowerCase() === pax.name.toLowerCase()
          );
          return {
            ...pax,
            attendance: paxAttendance,
            qCount: paxAttendance.filter(a => a.isQ).length
          };
        });

        setPaxList(mergedData.sort((a, b) => b.posts - a.posts));
        setIsLive(true);
      } catch (error) {
        console.error("Failed to fetch live data:", error);
        // Fallback Demo Data
        setPaxList([
          { 
            name: "Mickey (Demo)", 
            posts: 239, 
            consistency: 71, 
            firstBD: "5/16/2024", 
            lastBD: "2/6/2026", 
            homeAo: "Helios", 
            awards: ['Cindy']
          }
        ]);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { paxList, loading, isLive };
};