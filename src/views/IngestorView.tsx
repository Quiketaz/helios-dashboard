import React, { useState } from 'react';
import { Upload, CheckCircle2, RefreshCw, Lock } from 'lucide-react';
import { processRawCSV } from '../services/dataService';
import type { PaxData } from '../types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
const GID = import.meta.env.VITE_HELIOS_GID;
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

export const IngestorView = () => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<PaxData[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert("Incorrect Password");
  };

  const handleSync = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(GOOGLE_SHEET_URL);
      const text = await res.text();
      // Uses identical logic as the main dashboard
      setData(processRawCSV(text));
    } catch (err) {
      alert("Sync failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 w-full max-w-md shadow-2xl">
          <Lock className="text-yellow-400 mb-4 mx-auto" size={40} />
          <h2 className="text-2xl font-black italic text-white text-center mb-6 uppercase tracking-tighter">Admin Access</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 transition-colors" 
              value={passkey} 
              onChange={(e) => setPasskey(e.target.value)} 
            />
            <button className="w-full bg-yellow-400 text-black font-black py-3 rounded-xl hover:bg-yellow-300 transition-all">UNLOCK PORTAL</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-xl">
        <h2 className="text-2xl font-black italic text-white mb-2 uppercase tracking-tighter">Data Ingestor</h2>
        <p className="text-zinc-500 text-sm mb-8 font-bold uppercase tracking-widest">Single Source: Google Sheets Cloud</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={handleSync} className="flex items-center justify-center gap-3 p-6 bg-yellow-400/10 border-2 border-yellow-400/20 rounded-2xl text-yellow-400 font-black hover:bg-yellow-400/20 transition-all">
            <RefreshCw className={isProcessing ? 'animate-spin' : ''} /> SYNC CLOUD
          </button>
          <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer text-zinc-500 font-black hover:border-yellow-400/50 transition-all">
            <Upload size={20} /> UPLOAD CSV
            <input type="file" className="hidden" accept=".csv" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    setIsProcessing(true);
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setData(processRawCSV(ev.target?.result as string));
                      setIsProcessing(false);
                    };
                    reader.readAsText(file);
                }
            }} />
          </label>
        </div>
      </div>
      {data && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 text-green-500 font-black italic flex items-center gap-3 shadow-lg">
          <CheckCircle2 size={24} /> 
          <div>
            <p className="text-lg leading-none">{data.length} RECORDS PROCESSED</p>
            <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">Ready for regional aggregation</p>
          </div>
        </div>
      )}
    </div>
  );
};