import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Check, Palette } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';

type ThemeMode = 'light' | 'dark' | 'system';

export const SettingsView = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as ThemeMode) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
    
    localStorage.setItem('theme', mode);
  }, [mode]);

  const options: { value: ThemeMode; label: string; icon: typeof Moon }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black italic text-primary uppercase tracking-tighter">Settings</h2>
        <p className="text-on-surface-variant font-medium">Customize your Helios dashboard experience.</p>
      </div>

      <DashboardCard className="p-6 md:p-8 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-primary" size={24} />
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-wide">Appearance</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setMode(option.value)}
              className={`
                relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${mode === option.value 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:border-outline-variant/40'}
              `}
            >
              <option.icon size={24} />
              <span className="font-bold uppercase tracking-wider text-xs">{option.label}</span>
              {mode === option.value && (
                <div className="absolute top-3 right-3 text-primary">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};
