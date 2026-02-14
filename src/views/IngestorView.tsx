import React, { useState } from 'react';
import { Upload, CheckCircle2, RefreshCw, Lock, FolderOpen, BarChart3, Users, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';
import { processRawCSV, fetchLocalCSV } from '../services/dataService';
import { detectCSVType, parseAttendanceCSV, parsePostingsCSV, parseQScheduleCSV, getAttendanceStats, getPostingStats, getQScheduleStats, validateAttendanceCSV, validatePostingsCSV, validateQScheduleCSV, type ValidationResult, type QScheduleRecord } from '../services/csvParser';
import type { PaxData } from '../types';
import type { AttendanceRecord, QPostingAnalytics } from '../services/csvParser';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SHEET_ID = import.meta.env.VITE_HELIOS_SHEET_ID;
// Prefer explicit postings GID for roster sync
const GID = import.meta.env.VITE_HELIOS_POSTINGS_GID || import.meta.env.VITE_HELIOS_GID;
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

type DataType = 'roster' | 'attendance' | 'postings' | 'qschedule' | null;

export const IngestorView = () => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rosterData, setRosterData] = useState<PaxData[] | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[] | null>(null);
  const [postingsData, setPostingsData] = useState<QPostingAnalytics[] | null>(null);
  const [qscheduleData, setQScheduleData] = useState<QScheduleRecord[] | null>(null);
  const [dataType, setDataType] = useState<DataType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<ValidationResult | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert("Incorrect Password");
  };

  const handleSync = async () => {
    setIsProcessing(true);
    setLoadError(null);
    setValidationWarnings(null);
    try {
      const res = await fetch(GOOGLE_SHEET_URL);
      const text = await res.text();
      setRosterData(processRawCSV(text));
      setDataType('roster');
    } catch (err) {
      const e = err as Error;
      setLoadError(`Sync from Google Sheets failed: ${e.message || String(err)}\n${e.stack || ''}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const localCSVFiles = [
    { name: 'Helios Q Sheet - Q Helios.csv', type: 'Q Schedule', gid: import.meta.env.VITE_HELIOS_Q_GID },
    { name: 'Helios Q Sheet - Attendance.csv', type: 'Attendance', gid: import.meta.env.VITE_HELIOS_ATTENDANCE_GID },
    { name: 'Helios Q Sheet - Postings Count.csv', type: 'Postings', gid: import.meta.env.VITE_HELIOS_POSTINGS_GID || import.meta.env.VITE_HELIOS_GID },
    { name: 'sample-roster.csv', type: 'Roster', gid: import.meta.env.VITE_HELIOS_GID },
  ];

  const makeSheetUrl = (gid?: string | number) => {
    if (!SHEET_ID || !gid) return null;
    return `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
  };

  const handleSyncFor = async (gid?: string | number, fallbackName?: string) => {
    setIsProcessing(true);
    setLoadError(null);
    setValidationWarnings(null);
    try {
      const url = makeSheetUrl(gid);
      if (!url) {
        setLoadError(`No cloud URL available for ${fallbackName || 'this file'}`);
        return;
      }
      const res = await fetch(url);
      const text = await res.text();

      // reuse the same detection & parsing logic as local file loader
      const detectedType = detectCSVType(text);
      if (detectedType === 'roster') {
        setRosterData(processRawCSV(text));
        setDataType('roster');
      } else if (detectedType === 'attendance') {
        const parsed = parseAttendanceCSV(text);
        setAttendanceData(parsed);
        const validation = validateAttendanceCSV(text);
        setValidationWarnings(validation);
        setDataType('attendance');
      } else if (detectedType === 'postings') {
        const parsed = parsePostingsCSV(text);
        setPostingsData(parsed);
        const validation = validatePostingsCSV(text);
        setValidationWarnings(validation);
        setDataType('postings');
      } else if (detectedType === 'qschedule') {
        const parsed = parseQScheduleCSV(text);
        setQScheduleData(parsed);
        const validation = validateQScheduleCSV(text);
        setValidationWarnings(validation);
        setDataType('qschedule');
      } else {
        setLoadError('Unable to detect CSV format from cloud.');
        setDataType(null);
      }
    } catch (err) {
      const e = err as Error;
      setLoadError(`Sync from Google Sheets failed: ${e.message || String(err)}\n${e.stack || ''}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadLocalFile = async (filename: string) => {
    setIsProcessing(true);
    setLoadError(null);
    setValidationWarnings(null);
    try {
      const csvText = await fetchLocalCSV(filename);
      const detectedType = detectCSVType(csvText);
      
      if (detectedType === 'roster') {
        setRosterData(processRawCSV(csvText));
        setDataType('roster');
      } else if (detectedType === 'attendance') {
        const parsed = parseAttendanceCSV(csvText);
        setAttendanceData(parsed);
        const validation = validateAttendanceCSV(csvText);
        setValidationWarnings(validation);
        setDataType('attendance');
      } else if (detectedType === 'postings') {
        const parsed = parsePostingsCSV(csvText);
        setPostingsData(parsed);
        const validation = validatePostingsCSV(csvText);
        setValidationWarnings(validation);
        setDataType('postings');
      } else if (detectedType === 'qschedule') {
        const parsed = parseQScheduleCSV(csvText);
        setQScheduleData(parsed);
        const validation = validateQScheduleCSV(csvText);
        setValidationWarnings(validation);
        setDataType('qschedule');
      } else {
        setLoadError("Unable to detect CSV format. Please check headers.");
        setDataType(null);
      }
    } catch (err) {
      const e = err as Error;
      setLoadError(`Failed to load: ${filename} — ${e.message || String(err)}\n${e.stack || ''}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (csvText: string) => {
    try {
      const detectedType = detectCSVType(csvText);
      if (detectedType === 'roster') {
        setRosterData(processRawCSV(csvText));
        setDataType('roster');
      } else if (detectedType === 'attendance') {
        const parsed = parseAttendanceCSV(csvText);
        setAttendanceData(parsed);
        const validation = validateAttendanceCSV(csvText);
        setValidationWarnings(validation);
        setDataType('attendance');
      } else if (detectedType === 'postings') {
        const parsed = parsePostingsCSV(csvText);
        setPostingsData(parsed);
        const validation = validatePostingsCSV(csvText);
        setValidationWarnings(validation);
        setDataType('postings');
      } else if (detectedType === 'qschedule') {
        const parsed = parseQScheduleCSV(csvText);
        setQScheduleData(parsed);
        const validation = validateQScheduleCSV(csvText);
        setValidationWarnings(validation);
        setDataType('qschedule');
      } else {
        setLoadError("Unable to detect CSV format. Please check headers.");
        setDataType(null);
      }
    } catch (err) {
      const e = err as Error;
      setLoadError(`Processing uploaded file failed: ${e.message || String(err)}\n${e.stack || ''}`);
      console.error(err);
    }
  };

  const clearErrors = () => {
    setLoadError(null);
    setValidationWarnings(null);
  };

  const hardRefresh = () => {
    // full page reload to clear any residual runtime state
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 w-full max-w-md shadow-2xl">
          <Lock className="text-yellow-400 mb-4 mx-auto" size={40} />
          <h2 className="text-2xl font-black italic text-white text-center mb-6 uppercase tracking-tighter">Nantan Access</h2>
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
        <h2 className="text-2xl font-black italic text-white mb-2 uppercase tracking-tighter">AO Operations</h2>
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
              <div>SYNC MOTHERSHIP</div>
              <div className="text-xs font-bold opacity-70">Google Sheets</div>
            </div>
          </button>

          {/* Upload CSV File */}
          <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer text-zinc-500 font-black hover:border-yellow-400/50 hover:text-yellow-400 transition-all">
            <Upload size={20} />
            <div className="text-left">
              <div>UPLOAD WEINKE</div>
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

          {/* Placeholder for balance (3-column grid) */}
          <div></div>
        </div>

        {/* Local CSV Preset Files */}
        <div className="mt-8">
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">📁 Load Local Intel</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {localCSVFiles.map((file) => (
              <div key={file.name} className="flex flex-col items-stretch gap-2">
                <button
                  onClick={() => handleLoadLocalFile(file.name)}
                  disabled={isProcessing}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-900/20 border-2 border-blue-500/30 rounded-xl text-blue-400 font-bold hover:bg-blue-500/20 hover:border-blue-400 transition-all disabled:opacity-50 text-xs"
                >
                  <FolderOpen size={18} />
                  <span className="text-center line-clamp-2">{file.name.replace('.csv', '')}</span>
                  <span className="text-blue-600 text-xs">{file.type}</span>
                </button>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSyncFor((file as any).gid, file.name)}
                    disabled={isProcessing || !(file as any).gid}
                    title={((file as any).gid) ? `Sync cloud for ${file.name}` : 'No cloud GID configured'}
                    className="flex items-center justify-center gap-2 w-full p-2 bg-transparent border-2 border-dashed border-zinc-800 rounded-xl text-zinc-400 hover:border-yellow-400/50 hover:text-yellow-400 transition-all disabled:opacity-40 text-xs"
                  >
                    <RefreshCw size={14} />
                    <span className="font-bold">SYNC MOTHERSHIP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 space-y-2 text-xs text-zinc-500 leading-relaxed">
          <p>💡 <strong>Load Options:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>🌐 <strong>Sync Mothership:</strong> Fetch postings/roster data from Google Sheets</li>
            <li>📤 <strong>Upload Weinke:</strong> Upload any CSV file (auto-detects format)</li>
            <li>📁 <strong>Local Intel:</strong> Quick-load preset CSVs from <code className="bg-black/50 px-2 py-1 rounded">public/data/</code></li>
          </ul>
          <p className="mt-3"><strong>Supported Formats:</strong> Roster, Attendance, Postings, Q Schedule</p>
        </div>
      </div>

      {/* Error Message */}
      {loadError && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6 text-red-400 font-bold space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={18} />
                <div className="font-bold">Load Error</div>
              </div>
              <div className="text-sm text-red-300 mt-2 whitespace-pre-wrap">{loadError}</div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <button onClick={clearErrors} className="px-3 py-2 bg-red-700/40 hover:bg-red-700/60 rounded-md text-sm font-bold">Clear Errors</button>
              <button onClick={hardRefresh} className="px-3 py-2 bg-zinc-900/40 hover:bg-zinc-900/60 rounded-md text-sm font-bold flex items-center gap-2">
                <RefreshCw size={14} />
                Hard Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings/Issues */}
      {validationWarnings && (
        <div className="space-y-4">
          {validationWarnings.isDuplicate && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold">⚠️ Duplicate Headers Detected</p>
                  <p className="text-yellow-600 text-sm mt-1">Some column names are repeated. Results may be inconsistent.</p>
                </div>
              </div>
            </div>
          )}

          {validationWarnings.missingHeaders.length > 0 && (
            <div className="bg-orange-900/20 border border-orange-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-400 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-orange-400 font-bold">⚠️ Missing Required Headers</p>
                  <p className="text-orange-600 text-sm mt-1">Expected columns not found: <strong>{validationWarnings.missingHeaders.join(', ')}</strong></p>
                </div>
              </div>
            </div>
          )}

          {validationWarnings.rowsWithIssues > 0 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-red-400 font-bold">🔴 Data Quality Issues ({validationWarnings.rowsWithIssues} rows affected)</p>
                  <div className="text-red-600 text-sm mt-2 max-h-48 overflow-y-auto">
                    {validationWarnings.issues.slice(0, 10).map((issue, idx) => (
                      <div key={idx} className="mb-2 pb-2 border-b border-red-500/20 last:border-0">
                        <span className="font-bold">Row {issue.row}, {issue.field}:</span> {issue.issue}
                      </div>
                    ))}
                    {validationWarnings.issues.length > 10 && (
                      <p className="text-red-600 font-bold mt-2">... and {validationWarnings.issues.length - 10} more issues</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={20} />
              <div>
                <p className="text-green-400 font-bold">Rows Processed: {validationWarnings.rowsProcessed}</p>
                <p className="text-green-600 text-sm">Valid rows ready for analysis</p>
              </div>
            </div>
          </div>
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

      {/* Q Schedule Data Summary */}
      {dataType === 'qschedule' && qscheduleData && (() => {
        const stats = getQScheduleStats(qscheduleData);
        return (
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-purple-400" size={24} />
              <div>
                <h3 className="text-2xl font-black text-purple-400">Q Schedule</h3>
                <p className="text-xs text-purple-600">Upcoming workouts & events</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-600 uppercase">Total Events</p>
                <p className="text-2xl font-black text-purple-400">{stats.totalEvents}</p>
              </div>
              <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-600 uppercase">Unique Q Leads</p>
                <p className="text-2xl font-black text-purple-400">{stats.uniqueQLeads}</p>
              </div>
              <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-600 uppercase">Event Types</p>
                <p className="text-2xl font-black text-purple-400">{stats.eventTypes.length}</p>
              </div>
              <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-600 uppercase">Date Range</p>
                <p className="text-sm font-black text-purple-400">{stats.earliestDate} to {stats.latestDate}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-purple-300 mb-3">📅 Event Types Breakdown:</p>
              <div className="space-y-2">
                {stats.eventTypes.map((et) => (
                  <div key={et.type} className="flex items-center justify-between p-3 bg-black/40 border border-purple-500/20 rounded-lg">
                    <span className="text-white font-bold">{et.type}</span>
                    <span className="text-purple-400 font-black">{et.count} events</span>
                  </div>
                ))}
              </div>
            </div>
            <CheckCircle2 className="text-green-500 inline-block mt-6" size={20} />
            <p className="text-green-500 font-bold mt-2">✓ Ready for schedule planning & analysis</p>
          </div>
        );
      })()}
    </div>
  );
};