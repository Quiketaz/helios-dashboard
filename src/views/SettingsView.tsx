import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Check, Palette, Type } from 'lucide-react';
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

  const [bigText, setBigText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bigText') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    bigText ? root.classList.add('big-text') : root.classList.remove('big-text');
    localStorage.setItem('bigText', String(bigText));
  }, [bigText]);

  const options: { value: ThemeMode; label: string; icon: typeof Moon }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black italic text-on-surface uppercase tracking-tighter">
          System <span className="text-primary">Settings</span>
        </h1>
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Configuration & Preferences</p>
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

        <div className="flex items-center gap-3 mb-6 mt-8 pt-8 border-t border-outline-variant/10">
          <Type className="text-primary" size={24} />
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-wide">Accessibility</h3>
        </div>

        <button
          onClick={() => setBigText(!bigText)}
          className={`
            w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left
            ${bigText 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:border-outline-variant/40'}
          `}
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold uppercase tracking-wider text-xs">Big Text Mode</span>
            <span className="text-xs opacity-80 font-medium">Increase font size & icon contrast</span>
          </div>
          {bigText && <Check size={20} strokeWidth={3} />}
        </button>
      </DashboardCard>
    </div>
  );
};
