import React, { useState } from 'react';
import { Upload, CheckCircle2, RefreshCw, Lock, FolderOpen, BarChart3, Users } from 'lucide-react';
import { processRawCSV, fetchLocalCSV } from '../services/dataService';
import { detectCSVType, parseAttendanceCSV, parsePostingsCSV, getAttendanceStats, getPostingStats } from '../services/csvParser';
import type { PaxData } from '../types';
import type { AttendanceRecord, QPostingAnalytics } from '../services/csvParser';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
// Prefer explicit postings GID for roster sync
const GID = import.meta.env.VITE_HELIOS_POSTINGS_GID || import.meta.env.VITE_HELIOS_GID;
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

type DataType = 'roster' | 'attendance' | 'postings' | null;

export const IngestorView = () => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rosterData, setRosterData] = useState<PaxData[] | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[] | null>(null);
  const [postingsData, setPostingsData] = useState<QPostingAnalytics[] | null>(null);
  const [dataType, setDataType] = useState<DataType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localFilename, setLocalFilename] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert("Incorrect Password");
  };

  const handleSync = async () => {
    setIsProcessing(true);
    setLoadError(null);
    try {
      const res = await fetch(GOOGLE_SHEET_URL);
      const text = await res.text();
      setRosterData(processRawCSV(text));
      setDataType('roster');
    } catch (err) {
      setLoadError("Sync failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadLocal = async () => {
    if (!localFilename.trim()) {
      setLoadError("Please enter a filename");
      return;
    }

    setIsProcessing(true);
    setLoadError(null);
    try {
      const csvText = await fetchLocalCSV(localFilename);
      const detectedType = detectCSVType(csvText);
      
      if (detectedType === 'roster') {
        setRosterData(processRawCSV(csvText));
      } else if (detectedType === 'attendance') {
        setAttendanceData(parseAttendanceCSV(csvText));
      } else if (detectedType === 'postings') {
        setPostingsData(parsePostingsCSV(csvText));
      }
      setDataType(detectedType);
    } catch (err) {
      setLoadError(`Failed to load: ${localFilename}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (csvText: string) => {
    const detectedType = detectCSVType(csvText);
    
    if (detectedType === 'roster') {
      setRosterData(processRawCSV(csvText));
    } else if (detectedType === 'attendance') {
      setAttendanceData(parseAttendanceCSV(csvText));
    } else if (detectedType === 'postings') {
      setPostingsData(parsePostingsCSV(csvText));
    }
    setDataType(detectedType);
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
        <p className="text-zinc-500 text-sm mb-8 font-bold uppercase tracking-widest">🌐 Online • 📁 Local • 📤 Upload</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sync Cloud */}
          <button 
            onClick={handleSync} 
            disabled={isProcessing}
            className="flex items-center justify-center gap-3 p-6 bg-yellow-400/10 border-2 border-yellow-400/20 rounded-2xl text-yellow-400 font-black hover:bg-yellow-400/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={isProcessing ? 'animate-spin' : ''} size={20} /> 
            <div className="text-left">
              <div>SYNC CLOUD</div>
              <div className="text-xs font-bold opacity-70">Google Sheets</div>
            </div>
          </button>

          {/* Load Local CSV */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-4 bg-blue-900/20 border-2 border-blue-500/30 rounded-2xl">
              <FolderOpen className="text-blue-400" size={20} />
              <input
                type="text"
                placeholder="filename.csv"
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none font-bold text-sm"
                value={localFilename}
                onChange={(e) => setLocalFilename(e.target.value)}
              />
            </div>
            <button
              onClick={handleLoadLocal}
              disabled={isProcessing || !localFilename.trim()}
              className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-400 font-black hover:bg-blue-500/30 transition-all disabled:opacity-50 text-sm"
            >
              LOAD LOCAL
            </button>
          </div>

          {/* Upload CSV File */}
          <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer text-zinc-500 font-black hover:border-yellow-400/50 hover:text-yellow-400 transition-all">
            <Upload size={20} />
            <div className="text-left">
              <div>UPLOAD CSV</div>
              <div className="text-xs font-bold opacity-70">Auto-detect type</div>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    setIsProcessing(true);
                    setLoadError(null);
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      handleFileUpload(ev.target?.result as string);
                      setIsProcessing(false);
                    };
                    reader.readAsText(file);
                }
              }} 
            />
          </label>
        </div>

        {/* Info Text */}
        <div className="mt-6 space-y-2 text-xs text-zinc-500 leading-relaxed">
          <p>💡 <strong>Supported Formats:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>📊 <strong>Roster:</strong> PAX attendance metrics (Name, BD Count, Consistency, etc.)</li>
            <li>📈 <strong>Attendance:</strong> Complete history with Q leads (Year, Month, Name, BD, etc.)</li>
            <li>🎯 <strong>Postings:</strong> Q leader analytics (Q Name, Posting dates, counts)</li>
          </ul>
          <p className="mt-3">Place CSV files in <code className="bg-black/50 px-2 py-1 rounded">public/data/</code> to load locally.</p>
        </div>
      </div>

      {/* Error Message */}
      {loadError && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6 text-red-400 font-bold">
          ⚠️ {loadError}
        </div>
      )}

      {/* Roster Data Summary */}
      {dataType === 'roster' && rosterData && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-2xl font-black text-yellow-400">PAX Roster Data</h3>
              <p className="text-xs text-yellow-600">Member attendance & metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-600 uppercase">Members</p>
              <p className="text-2xl font-black text-yellow-400">{rosterData.length}</p>
            </div>
            <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-600 uppercase">Avg Posts</p>
              <p className="text-2xl font-black text-yellow-400">
                {Math.round(rosterData.reduce((sum, p) => sum + p.posts, 0) / rosterData.length)}
              </p>
            </div>
            <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-600 uppercase">Total Posts</p>
              <p className="text-2xl font-black text-yellow-400">
                {rosterData.reduce((sum, p) => sum + p.posts, 0)}
              </p>
            </div>
            <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs font-bold text-yellow-600 uppercase">Avg Consistency</p>
              <p className="text-2xl font-black text-yellow-400">
                {Math.round(rosterData.reduce((sum, p) => sum + p.consistency, 0) / rosterData.length)}%
              </p>
            </div>
          </div>
          <CheckCircle2 className="text-green-500 inline-block mt-6" size={20} />
          <p className="text-green-500 font-bold mt-2">✓ Ready for dashboard aggregation</p>
        </div>
      )}

      {/* Attendance Data Summary */}
      {dataType === 'attendance' && attendanceData && (() => {
        const stats = getAttendanceStats(attendanceData);
        return (
          <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-green-400" size={24} />
              <div>
                <h3 className="text-2xl font-black text-green-400">Attendance History</h3>
                <p className="text-xs text-green-600">Complete BD/DD records with Q leads</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-green-600 uppercase">Records</p>
                <p className="text-2xl font-black text-green-400">{stats.totalRecords}</p>
              </div>
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-green-600 uppercase">Unique PAX</p>
                <p className="text-2xl font-black text-green-400">{stats.uniquePax}</p>
              </div>
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-green-600 uppercase">Total BDs</p>
                <p className="text-2xl font-black text-green-400">{stats.totalBDs}</p>
              </div>
              <div className="bg-black/40 border border-green-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-green-600 uppercase">Q Leaders</p>
                <p className="text-2xl font-black text-green-400">{stats.uniqueQs}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-zinc-400">
              <p>📅 Period: <strong>{stats.dateRange.earliest}</strong> to <strong>{stats.dateRange.latest}</strong></p>
            </div>
            <CheckCircle2 className="text-green-500 inline-block mt-6" size={20} />
            <p className="text-green-500 font-bold mt-2">✓ Excellent training data for analytics</p>
          </div>
        );
      })()}

      {/* Postings Data Summary */}
      {dataType === 'postings' && postingsData && (() => {
        const stats = getPostingStats(postingsData);
        return (
          <div className="bg-gradient-to-r from-cyan-900/20 to-cyan-800/10 border border-cyan-500/30 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-cyan-400" size={24} />
              <div>
                <h3 className="text-2xl font-black text-cyan-400">Q Posting Analytics</h3>
                <p className="text-xs text-cyan-600">Q leader statistics & frequency</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-cyan-600 uppercase">Total Qs</p>
                <p className="text-2xl font-black text-cyan-400">{stats.totalQs}</p>
              </div>
              <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-cyan-600 uppercase">Q Leaders</p>
                <p className="text-2xl font-black text-cyan-400">{postingsData.length}</p>
              </div>
              <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-cyan-600 uppercase">Avg per Leader</p>
                <p className="text-2xl font-black text-cyan-400">{stats.averageQsPerLeader}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-cyan-300 mb-3">🏆 Top Q Leaders:</p>
              <div className="space-y-2">
                {stats.topQs.map((q, idx) => (
                  <div key={q.name} className="flex items-center justify-between p-3 bg-black/40 border border-cyan-500/20 rounded-lg">
                    <span className="text-white font-bold">#{idx + 1} {q.name}</span>
                    <span className="text-cyan-400 font-black">{q.qCount}Q</span>
                  </div>
                ))}
              </div>
            </div>
            <CheckCircle2 className="text-green-500 inline-block mt-6" size={20} />
            <p className="text-green-500 font-bold mt-2">✓ Great for Q leader leaderboards</p>
          </div>
        );
      })()}
    </div>
  );
};