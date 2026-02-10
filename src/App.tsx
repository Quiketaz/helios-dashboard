import { useState } from 'react';
import { LayoutDashboard, Users, Search, ShieldAlert, Calendar } from 'lucide-react';
import type { TabType, PaxData } from './types';
import { usePaxData } from './hooks/usePaxData';
import { useQData } from './hooks/useQData';
import { Logo } from './components/Logo';
import { DashboardView } from './views/DashboardView';
import { RosterView } from './views/RosterView';
import { ScheduleView } from './views/ScheduleView';
import { IngestorView } from './views/IngestorView';
import { ProfileView } from './views/ProfileView';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPax, setSelectedPax] = useState<PaxData | null>(null);
  const { paxList, loading } = usePaxData();
  const { qList, loading: qLoading, error: qError } = useQData();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-black italic tracking-widest uppercase">SYNCING HELIOS...</div>;

  // Show profile view if a PAX is selected
  if (selectedPax) {
    return <ProfileView pax={selectedPax} onBack={() => setSelectedPax(null)} />;
  }

  const filteredPax = paxList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans flex flex-col md:flex-row">
      <nav className="w-full md:w-20 lg:w-64 bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col gap-2">
        <div className="hidden lg:block mb-8 text-2xl font-black italic text-white uppercase tracking-tighter">HELIOS<span className="text-yellow-400">.</span></div>
        <NavBtn id="DASHBOARD" active={activeTab} set={setActiveTab} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        <NavBtn id="ROSTER" active={activeTab} set={setActiveTab} icon={<Users size={20}/>} label="PAX Roster" />
        <NavBtn id="SCHEDULE" active={activeTab} set={setActiveTab} icon={<Calendar size={20}/>} label="Q Schedule" />
        <div className="mt-auto pt-4 border-t border-zinc-900">
          <NavBtn id="ADMIN" active={activeTab} set={setActiveTab} icon={<ShieldAlert size={20}/>} label="Admin Portal" />
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <header className="p-10 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <h1 className="text-4xl font-black italic text-white uppercase">{activeTab}</h1>
          </div>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input type="text" placeholder="Search PAX..." className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm w-full outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>
        <main className="p-4 md:p-10 max-w-7xl mx-auto">
          {activeTab === 'DASHBOARD' && <DashboardView paxList={paxList} qList={qList} onPaxClick={setSelectedPax} />}
          {activeTab === 'ROSTER' && <RosterView filteredPax={filteredPax} onPaxClick={setSelectedPax} />}
          {activeTab === 'SCHEDULE' && <ScheduleView qList={qList} loading={qLoading} error={qError} />}
          {activeTab === 'ADMIN' && <IngestorView />}
        </main>
      </div>
    </div>
  );
};

const NavBtn = ({ id, active, set, icon, label }: any) => (
  <button onClick={() => set(id)} className={`flex items-center gap-4 p-3 rounded-xl transition-all w-full ${active === id ? 'bg-yellow-400 text-black font-black' : 'text-zinc-500 hover:text-white'}`}>
    {icon} <span className="hidden lg:block text-sm">{label}</span>
  </button>
);

export default App;
