import { useState } from 'react';
import { Search } from 'lucide-react';
import type { TabType, PaxData } from './types';
import { usePaxData } from './hooks/usePaxData';
import { useQData } from './hooks/useQData';
import { Logo } from './components/Logo';
import { DashboardView } from './views/DashboardView';
import { RosterView } from './views/RosterView';
import { ScheduleView } from './views/ScheduleView';
import { IngestorView } from './views/IngestorView';
import { ProfileView } from './views/ProfileView';
import { Navigation } from './components/Navigation';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPax, setSelectedPax] = useState<PaxData | null>(null);
  const { paxList, loading } = usePaxData();
  const { qList, loading: qLoading, error: qError } = useQData();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-yellow-400/20 animate-pulse rounded-full" />
          <Logo size="sm" />
        </div>
        <div className="text-yellow-400 font-black italic tracking-[0.3em] uppercase text-xs animate-pulse">
          Syncing Helios
        </div>
      </div>
    );
  }

  // Show profile view if a PAX is selected
  if (selectedPax) {
    return <ProfileView pax={selectedPax} onBack={() => setSelectedPax(null)} />;
  }

  const filteredPax = paxList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex flex-col lg:flex-row selection:bg-yellow-400/30">
      <Navigation activeTab={activeTab.toLowerCase()} onTabChange={(tab) => setActiveTab(tab.toUpperCase() as TabType)} />

      <div className="flex-1 overflow-y-auto lg:pl-20">
        <header className="p-4 md:px-8 lg:px-12 border-b border-white/10 flex justify-between items-center sticky top-0 bg-zinc-900/40 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-base md:text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                F3 <span className="text-yellow-400">HELIOS</span>
              </span>
            </div>
            <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight hidden sm:block">{activeTab}</h1>
          </div>
          <div className="relative w-64 md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search PAX..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm w-full outline-none focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-zinc-600" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>
        <main className="p-4 md:p-8 lg:p-12 pb-24 lg:pb-12 max-w-7xl mx-auto">
          {activeTab === 'DASHBOARD' && <DashboardView paxList={paxList} qList={qList} onPaxClick={setSelectedPax} />}
          {activeTab === 'ROSTER' && <RosterView filteredPax={filteredPax} onPaxClick={setSelectedPax} />}
          {activeTab === 'SCHEDULE' && <ScheduleView qList={qList} loading={qLoading} error={qError} />}
          {activeTab === 'ADMIN' && <IngestorView />}
        </main>
      </div>
    </div>
  );
};

export default App;
