import { useState } from 'react';
import { Calendar, Clock, User, AlertCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getWeekRange, formatWeekLabel, getEventsForWeek, parseDate } from '../utils/dateUtils';

export const ScheduleView = () => {
  const { qList, qLoading: loading, qError: error } = useData();
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
          <div className="flex items-center justify-between bg-surface-container border border-outline-variant/20 rounded-3xl p-3 md:p-4 shadow-sm">
            <button
              onClick={() => setWeekOffset(Math.max(weekOffset - 1, 0))}
              disabled={weekOffset === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-highest border border-outline-variant/30 rounded-2xl text-on-surface-variant font-bold hover:text-primary hover:bg-primary/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex flex-col items-center">
              <p className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">Week Of</p>
              <p className="text-base md:text-lg font-black text-on-surface">{weekLabel}</p>
            </div>

            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-highest border border-outline-variant/30 rounded-2xl text-on-surface-variant font-bold hover:text-primary hover:bg-primary/10 transition-all active:scale-95"
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
                    className="relative bg-surface-container-low border border-outline-variant/20 rounded-2xl p-3 md:p-5 hover:bg-surface-container-high transition-all group overflow-hidden shadow-sm"
                  >
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none -rotate-12 text-on-surface">
                      <Calendar size={100} />
                    </div>

                    <div className="relative z-10 flex items-center gap-4 md:gap-8">
                      {/* Date Block */}
                      <div className="flex-shrink-0 flex flex-col items-center justify-center bg-surface-container-highest rounded-xl w-14 h-14 md:w-20 md:h-20 border border-outline-variant/30 shadow-inner">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">{monthShort}</span>
                        <span className="text-xl md:text-3xl font-black text-on-surface leading-none my-0.5">{dayNum}</span>
                        <span className="text-[10px] font-black text-primary uppercase">{q.day.substring(0, 3)}</span>
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 flex flex-col items-start space-y-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <User size={12} className="text-primary/50" />
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Q Lead</span>
                          </div>
                          <div className="text-lg md:text-2xl font-black text-on-surface group-hover:text-primary transition-colors tracking-tight">
                            {q.q || 'OPEN'}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/20 px-2 py-0.5 rounded-md">
                            <Clock size={10} className="text-on-surface-variant" />
                            <span className="text-[10px] font-bold text-on-surface">{q.time || '05:30'}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                            <Zap size={10} className="text-primary" />
                            <span className="text-[10px] font-bold text-primary">{q.type || 'Bootcamp'}</span>
                          </div>
                          {q.notes && q.notes !== 'Bootcamp' && (
                            <span className="text-[10px] text-on-surface-variant italic truncate max-w-[100px] md:max-w-none">{q.notes}</span>
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
          <div className="bg-surface-container border border-outline-variant/20 rounded-3xl p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              {weekEvents.length} Workout{weekEvents.length !== 1 ? 's' : ''} This Week
            </p>
            <p className="text-xs text-on-surface-variant/60 mt-2">Total Events: {qList.length} | Updated: {new Date().toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
};
