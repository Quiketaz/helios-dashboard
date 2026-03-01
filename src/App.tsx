import { useState } from 'react';
import type { TabType, PaxData } from './types';
import { usePaxData } from './hooks/usePaxData';
import { useQData } from './hooks/useQData';
import { Logo } from './components/Logo';
import { DashboardView } from './views/DashboardView';
import { RosterView } from './views/RosterView';
import { ScheduleView } from './views/ScheduleView';
import { IngestorView } from './views/IngestorView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { Navigation } from './components/Navigation';
import { TopAppBar } from './components/TopAppBar';

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
        <TopAppBar title={activeTab} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <main className="p-4 md:p-8 lg:p-12 pt-6 pb-24 lg:pb-12 max-w-7xl mx-auto">
          {activeTab === 'DASHBOARD' && <DashboardView paxList={paxList} qList={qList} onPaxClick={setSelectedPax} />}
          {activeTab === 'ROSTER' && <RosterView filteredPax={filteredPax} onPaxClick={setSelectedPax} />}
          {activeTab === 'SCHEDULE' && <ScheduleView qList={qList} loading={qLoading} error={qError} />}
          {activeTab === 'ADMIN' && <IngestorView />}
          {activeTab === 'ABOUT' && <AboutView />}
        </main>
      </div>
    </div>
  );
};

export default App;
