import { useState } from 'react';
import { Calendar, Clock, User, AlertCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [weekStart, weekEnd] = getWeekRange(weekOffset);
  const weekLabel = formatWeekLabel(weekStart, weekEnd);
  const weekEvents = getEventsForWeek(qList, weekOffset);

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-yellow-400 font-black italic tracking-widest animate-pulse">LOADING Q SCHEDULE...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-400 font-bold">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      ) : qList.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-zinc-500 font-bold italic text-center">
            <Calendar size={40} className="mx-auto mb-4 opacity-50" />
            No upcoming workouts scheduled
          </div>
        </div>
      ) : (
        <>
          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-3 md:p-4 shadow-2xl">
            <button
              onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
              disabled={weekOffset === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 font-bold hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex flex-col items-center">
              <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">Week Of</p>
              <p className="text-base md:text-lg font-black text-white">{weekLabel}</p>
            </div>

            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 font-bold hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/30 transition-all active:scale-95"
            >
              <span className="hidden sm:inline">Next</span>
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
            <div className="grid gap-3">
              {weekEvents.map((q, idx) => {
                const dateObj = parseDate(q.date);
                const dayNum = dateObj.getDate();
                const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <div
                    key={idx}
                    className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-5 hover:bg-white/[0.05] transition-all group overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none -rotate-12">
                      <Calendar size={100} />
                    </div>

                    <div className="relative z-10 flex items-center gap-4 md:gap-8">
                      {/* Date Block */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-xl w-14 h-14 md:w-20 md:h-20 border border-white/10 shadow-inner">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">{monthShort}</span>
                        <span className="text-xl md:text-3xl font-black text-white leading-none my-0.5">{dayNum}</span>
                        <span className="text-[10px] font-black text-yellow-400/80 uppercase">{q.day.substring(0, 3)}</span>
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 flex flex-col items-start space-y-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <User size={12} className="text-yellow-400/50" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Q Lead</span>
                          </div>
                          <div className="text-lg md:text-2xl font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight">
                            {q.q || 'OPEN'}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            <Clock size={10} className="text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-300">{q.time || '05:30'}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-md">
                            <Zap size={10} className="text-yellow-400" />
                            <span className="text-[10px] font-bold text-yellow-400/90">{q.type || 'Bootcamp'}</span>
                          </div>
                          {q.notes && q.notes !== 'Bootcamp' && (
                            <span className="text-[10px] text-zinc-500 italic truncate max-w-[100px] md:max-w-none">{q.notes}</span>
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
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-sm">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
              {weekEvents.length} Workout{weekEvents.length !== 1 ? 's' : ''} This Week
            </p>
            <p className="text-xs text-zinc-600 mt-2">Total Events: {qList.length} | Updated: {new Date().toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
};
