import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaxData } from '../types';

const ITEMS_PER_PAGE = 15;

export const RosterView = ({ filteredPax, onPaxClick }: { filteredPax: PaxData[], onPaxClick: (pax: PaxData) => void }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPax]);

  const totalPages = Math.ceil(filteredPax.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPax = filteredPax.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 mb-24 lg:mb-0">
      <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse hidden md:table">
      <thead>
        <tr className="bg-zinc-900/50">
          <th className="p-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">PAX Name</th>
          <th className="p-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-center">Posts</th>
          <th className="p-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-center">Consistency</th>
          <th className="p-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Last BD</th>
          <th className="p-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Awards</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-900">
        {paginatedPax.map((p) => (
          <tr
            key={p.name}
            onClick={() => onPaxClick(p)}
            className="hover:bg-zinc-900/20 transition-colors group cursor-pointer"
          >
            <td className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-yellow-400 group-hover:border-yellow-400 transition-colors">
                  {p.name[0]}
                </div>
                <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{p.name}</span>
              </div>
            </td>
            <td className="p-5 font-black text-white text-center">{p.posts}</td>
            <td className="p-5 text-center">
              <span className={`text-xs font-bold ${p.consistency > 50 ? 'text-green-500' : 'text-zinc-500'}`}>
                {p.consistency}%
              </span>
            </td>
            <td className="p-5 text-xs text-zinc-400 font-medium">{p.lastBD}</td>
            <td className="p-5">
              <div className="flex gap-2">
                {p.awards.map(a => (
                  <span key={a} className="grayscale hover:grayscale-0 transition-all cursor-help" title={a}>
                    {a.startsWith('Cindy') ? '🧱' : a.startsWith('Mug') ? '☕' : (
                      <span className="relative inline-block">
                        👕
                        {a.includes(':') && (
                          <span className="absolute -top-1 -right-1 bg-yellow-400 text-[8px] text-black font-black px-0.5 rounded-sm leading-none">
                            {a.split(':')[1]}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile Card View - Better for small screens */}
    <div className="md:hidden divide-y divide-zinc-900/50">
      {paginatedPax.map((p) => (
        <div
          key={p.name}
          onClick={() => onPaxClick(p)}
          className="p-4 hover:bg-zinc-900/20 active:bg-zinc-900/40 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg font-black text-yellow-400 group-active:scale-95 transition-transform">
              {p.name[0]}
            </div>
            <div>
              <div className="font-bold text-white">{p.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Last: {p.lastBD}</div>
                <div className="flex gap-1">
                  {p.awards.map(a => (
                    <span key={a} className="text-xs">
                      {a.startsWith('Cindy') ? '🧱' : a.startsWith('Mug') ? '☕' : '👕'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {p.awards.some(a => a.toLowerCase().startsWith('shirt')) && (
              <span className="text-[9px] font-black text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Centurion</span>
            )}
            <div className="text-lg font-black text-yellow-400">{p.posts}</div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase">Posts</div>
          </div>
        </div>
      ))}
    </div>
  </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-lg">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Showing <span className="text-white">{startIndex + 1}</span> to <span className="text-white">{Math.min(startIndex + ITEMS_PER_PAGE, filteredPax.length)}</span> of <span className="text-yellow-400">{filteredPax.length}</span> PAX
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-sm font-black text-white bg-black/40 px-4 py-2 rounded-lg border border-zinc-800">
              PAGE {currentPage} <span className="text-zinc-600 mx-1">/</span> {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 active:scale-95 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};