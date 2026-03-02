import { useState } from 'react';
import { Logo } from './components/Logo';
import { DashboardView } from './views/DashboardView';
import { RosterView } from './views/RosterView';
import { ScheduleView } from './views/ScheduleView';
import { IngestorView } from './views/IngestorView';
import { ProfileView } from './views/ProfileView';
import { LeaderboardView } from './views/LeaderboardView';
import { AboutView } from './views/AboutView';
import { Navigation } from './components/Navigation';
import { TopAppBar } from './components/TopAppBar';
import { DataProvider, useData } from './context/DataContext';
import type { TabType } from './types';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const { loading, selectedPax } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
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
    return <ProfileView />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans flex flex-col lg:flex-row selection:bg-primary/30">
      <Navigation activeTab={activeTab.toLowerCase()} onTabChange={(tab) => setActiveTab(tab.toUpperCase() as TabType)} />

      <div className="flex-1 overflow-y-auto lg:pl-20">
        <TopAppBar title={activeTab} />
        <main className="p-4 md:p-8 lg:p-12 pt-6 pb-24 lg:pb-12 max-w-7xl mx-auto">
          {activeTab === 'DASHBOARD' && <DashboardView />}
          {activeTab === 'ROSTER' && <RosterView />}
          {activeTab === 'SCHEDULE' && <ScheduleView />}
          {activeTab === 'STATS' && <LeaderboardView />}
          {activeTab === 'ADMIN' && <IngestorView />}
          {activeTab === 'ABOUT' && <AboutView />}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

export default App;
