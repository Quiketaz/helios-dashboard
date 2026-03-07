import { useState, useMemo } from 'react';
import { LayoutDashboard, Users, Calendar, Trophy, Settings, Shield, Search, X } from 'lucide-react';

import { DataProvider, useData } from './context/DataContext';
import { DashboardView } from './views/DashboardView';
import { RosterView } from './views/RosterView';
import { ScheduleView } from './views/ScheduleView';
import { IngestorView } from './views/IngestorView';
import { SettingsView } from './views/SettingsView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileView } from './views/ProfileView';
import { Logo } from './components/Logo';

type View = 'dashboard' | 'roster' | 'schedule' | 'achievements' | 'settings' | 'admin';

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roster', label: 'Roster', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Admin', icon: Shield },
];

const App = () => (
  <DataProvider>
    <AppContent />
  </DataProvider>
);

const AppContent = () => {
  const { selectedPax, searchTerm, setSearchTerm, filteredPax, qList } = useData();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeViewNeedsSearch = useMemo(() => 
    ['dashboard', 'roster', 'schedule'].includes(currentView), 
  [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'roster': return <RosterView />;
      case 'schedule': return <ScheduleView />;
      case 'achievements': return <AchievementsView />;
      case 'settings': return <SettingsView />;
      case 'admin': return <IngestorView />;
      default: return <DashboardView />;
    }
  };

  if (selectedPax) {
    return <ProfileView />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant/20 p-4">
        <div className="px-4 mb-8">
          <Logo />
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                currentView === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-on-surface/5'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="text-center text-xs text-on-surface-variant/50">
          <p>F3 Helios Dashboard</p>
          <p>v{__APP_VERSION__}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar for Mobile/Tablet */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-surface-container/80 backdrop-blur-lg border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <h1 className="text-lg font-black text-on-surface uppercase tracking-tighter">
              {navItems.find(i => i.id === currentView)?.label}
            </h1>
          </div>
          {activeViewNeedsSearch && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-on-surface-variant hover:text-primary"
            >
              <Search size={22} />
            </button>
          )}
        </header>

        {/* Search Bar for Desktop */}
        <div className="hidden lg:block p-6">
          {activeViewNeedsSearch && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
              <input
                type="text"
                placeholder={`Search ${filteredPax.length} PAX & ${qList.length} Q's...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-full py-3 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        {/* Search Overlay for Mobile */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-surface z-40 p-4 flex flex-col animate-in fade-in duration-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
              <input
                type="text"
                placeholder="Search PAX or Q..."
                value={searchTerm}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                autoFocus
                className="w-full bg-surface-container border border-outline-variant/20 rounded-full py-3 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-on-surface-variant hover:text-primary"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 pt-4" onClick={() => setIsSearchOpen(false)}>
              {/* This area can be used to show instant results if needed */}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 lg:p-6 lg:pt-0">
          {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-container/80 backdrop-blur-lg border-t border-outline-variant/20">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map(item => ( // Show first 5 items on mobile
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 w-full transition-all ${
                currentView === item.id ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;