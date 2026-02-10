import { useState } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { QRecord } from '../types';

interface ScheduleViewProps {
  qList: QRecord[];
  loading: boolean;
  error: string | null;
}

// Helper: Parse date string (M/D/YYYY format) to Date object
const parseDate = (dateStr: string): Date => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Helper: Get the start of the week (Sunday) for a given date
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek;
  return new Date(d.setDate(diff));
};

// Helper: Get week range as [start, end] dates
const getWeekRange = (weekOffset: number): [Date, Date] => {
  const today = new Date();
  const start = getWeekStart(today);
  start.setDate(start.getDate() + weekOffset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return [start, end];
};

// Helper: Format week label
const formatWeekLabel = (start: Date, end: Date): string => {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} - ${endStr}`;
};

// Helper: Filter events for a given week
const getEventsForWeek = (events: QRecord[], weekOffset: number): QRecord[] => {
  const [weekStart, weekEnd] = getWeekRange(weekOffset);
  return events
    .filter((event) => {
      try {
        const eventDate = parseDate(event.date);
        return eventDate >= weekStart && eventDate <= weekEnd;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      } catch {
        return 0;
      }
    });
};

export const ScheduleView = ({ qList, loading, error }: ScheduleViewProps) => {
  const [weekOffset, setWeekOffset] = useState(0);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-yellow-400 font-black italic tracking-widest">LOADING Q SCHEDULE...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 px-6 py-4 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-400 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      </div>
    );
  }

  if (qList.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-500 font-bold italic text-center">
          <Calendar size={40} className="mx-auto mb-4 opacity-50" />
          No upcoming workouts scheduled
        </div>
      </div>
    );
  }

  const [weekStart, weekEnd] = getWeekRange(weekOffset);
  const weekLabel = formatWeekLabel(weekStart, weekEnd);
  const weekEvents = getEventsForWeek(qList, weekOffset);

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
        <button
          onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
          disabled={weekOffset === 0}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-400 font-bold hover:bg-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="flex flex-col items-center">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Week Of</p>
          <p className="text-lg font-black text-white">{weekLabel}</p>
        </div>

        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-400 font-bold hover:bg-yellow-400/20 transition-all"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Events for Week */}
      {weekEvents.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-zinc-500 font-bold italic text-center">
            <Calendar size={40} className="mx-auto mb-4 opacity-50" />
            No workouts scheduled for this week
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {weekEvents.map((q, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-zinc-900/80 to-black/80 border border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all group"
          >
            <div className="grid md:grid-cols-5 gap-6">
              {/* Date & Day */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-yellow-400" size={20} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Date</span>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{q.date}</p>
                  <p className="text-sm font-bold text-yellow-400">{q.day}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-yellow-400" size={20} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Time</span>
                </div>
                <p className="text-2xl font-black text-white">{q.time || 'N/A'}</p>
              </div>

              {/* Type */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-yellow-400" size={20} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Type</span>
                </div>
                <div className="inline-block px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                  <p className="text-sm font-bold text-yellow-400">{q.type || 'Workout'}</p>
                </div>
              </div>

              {/* Q Lead */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-yellow-400" size={20} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Q Lead</span>
                </div>
                <p className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors">
                  {q.q || 'TBD'}
                </p>
              </div>

              {/* Location / Notes */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-yellow-400" size={20} />
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Location</span>
                </div>
                <p className="text-sm font-bold text-zinc-300">{q.notes || 'TBD'}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Weekly Summary Footer */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
          {weekEvents.length} Workout{weekEvents.length !== 1 ? 's' : ''} This Week
        </p>
        <p className="text-xs text-zinc-600 mt-2">Total Events: {qList.length} | Updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};
