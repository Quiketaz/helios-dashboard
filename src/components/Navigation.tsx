import { LayoutDashboard, Users, Calendar, Settings } from 'lucide-react';
import { Logo } from './Logo';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'The Gloom', icon: LayoutDashboard },
    { id: 'ROSTER', label: 'The Pax', icon: Users },
    { id: 'SCHEDULE', label: 'The Weinke', icon: Calendar },
    { id: 'ADMIN', label: 'Nantan', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <nav className="hidden md:flex flex-col sticky top-0 h-screen w-20 bg-zinc-950 border-r border-zinc-900 py-8 items-center gap-8 z-50">
        <Logo size="sm" />
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-yellow-400 text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav - Hidden on Desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-yellow-400 text-black' : 'text-zinc-500 group-hover:text-white'}`}>
              <item.icon size={20} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === item.id ? 'text-yellow-400' : 'text-zinc-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};