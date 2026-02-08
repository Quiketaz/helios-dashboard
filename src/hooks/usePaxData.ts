import { useState, useEffect } from 'react';
import type { PaxData } from '../types';
import { fetchPaxRoster } from '../services/dataService';

export const usePaxData = () => {
  const [paxList, setPaxList] = useState<PaxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchPaxRoster()
      .then(data => {
        setPaxList(data.sort((a, b) => b.posts - a.posts));
        setIsLive(true);
      })
      .catch(() => {
        // Fallback Demo Data
        setPaxList([
          { name: "Mickey (Demo)", posts: 239, consistency: 71, firstBD: "5/16/2024", lastBD: "2/6/2026", homeAo: "Helios", awards: ['Cindy'] }
        ]);
        setIsLive(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { paxList, loading, isLive };
};