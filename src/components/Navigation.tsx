import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Calendar, Settings } from 'lucide-react';
import { Logo } from './Logo';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ignore bounce scrolling on iOS
      if (currentScrollY < 0) return;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'DASHBOARD', label: 'The Gloom', icon: LayoutDashboard },
    { id: 'ROSTER', label: 'The Pax', icon: Users },
    { id: 'SCHEDULE', label: 'The Weinke', icon: Calendar },
    { id: 'ADMIN', label: 'Nantan', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <nav className="hidden md:flex flex-col sticky top-0 h-screen w-20 bg-surface border-r border-outline-variant/20 py-8 items-center gap-8 z-50">
        <Logo size="sm" />
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav - Hidden on Desktop */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-3 flex justify-between items-center z-50 pb-safe transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-on-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
              <item.icon size={20} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === item.id ? 'text-primary' : 'text-on-surface-variant'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
};