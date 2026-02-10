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
          {weekEvents.map((q, idx) => {
            const dateObj = parseDate(q.date);
            const dayNum = dateObj.getDate();
            const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });

            return (
              <div
                key={idx}
                className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 hover:border-yellow-400/50 transition-all group overflow-hidden"
              >
                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Calendar size={120} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  {/* Date Block */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl p-4 w-full md:w-32 border border-zinc-800/50">
                    <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{q.day}</span>
                    <span className="text-4xl font-black text-white leading-none my-1">{dayNum}</span>
                    <span className="text-sm font-bold text-yellow-400 uppercase">{monthShort}</span>
                  </div>

                  {/* Info Block */}
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <User size={14} className="text-yellow-400" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Q Lead</span>
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">
                        {q.q || 'OPEN'}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <Clock size={14} className="text-zinc-400" />
                        <span className="text-sm font-bold text-zinc-200">{q.time || '05:30'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="text-sm font-bold text-zinc-200">{q.type || 'Bootcamp'}</span>
                      </div>
                      {q.notes && (
                        <span className="text-sm text-zinc-500 italic border-l border-zinc-700 pl-3">{q.notes}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
