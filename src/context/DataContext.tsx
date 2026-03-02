import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { usePaxData } from '../hooks/usePaxData';
import { useQData } from '../hooks/useQData';
import type { PaxData, QRecord } from '../types';

interface DataContextType {
  paxList: PaxData[];
  loading: boolean;
  qList: QRecord[];
  qLoading: boolean;
  qError: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredPax: PaxData[];
  selectedPax: PaxData | null;
  setSelectedPax: (pax: PaxData | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { paxList, loading } = usePaxData();
  const { qList, loading: qLoading, error: qError } = useQData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPax, setSelectedPax] = useState<PaxData | null>(null);

  const filteredPax = useMemo(() => {
    return paxList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paxList, searchTerm]);

  const value = {
    paxList,
    loading,
    qList,
    qLoading,
    qError,
    searchTerm,
    setSearchTerm,
    filteredPax,
    selectedPax,
    setSelectedPax
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
