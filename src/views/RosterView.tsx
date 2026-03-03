import { useState } from 'react';
import { ChevronLeft, ChevronRight, UserX } from 'lucide-react';
//import type { PaxData } from '../types';
import { useData } from '../context/DataContext';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { getAwardIcon, getAwardLabel } from '../utils/f3';

const ITEMS_PER_PAGE = 15;

export const RosterView = () => {
  const { filteredPax, setSelectedPax: onPaxClick, searchTerm, setSearchTerm } = useData();
  useScrollPosition('roster-scroll-pos');
  const [currentPage, setCurrentPage] = useState(1);
  const [prevFilteredPax, setPrevFilteredPax] = useState(filteredPax);

  // Reset to first page when search results change
  if (filteredPax !== prevFilteredPax) {
    setPrevFilteredPax(filteredPax);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredPax.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPax = filteredPax.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 mb-24 lg:mb-0">
      {filteredPax.length === 0 && searchTerm ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-300">
          <div className="bg-surface-container-highest p-4 rounded-full mb-4">
            <UserX className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-1">
            No PAX Found
          </h3>
          <p className="text-on-surface-variant mb-6 max-w-xs text-sm">
            We couldn't find any PAX matching "{searchTerm}".
          </p>
          <button
            onClick={() => setSearchTerm && setSearchTerm('')}
            className="px-6 py-2.5 text-sm font-black text-on-primary bg-primary rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm uppercase tracking-wide"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
      <section className="bg-surface border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-surface-container">
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest">PAX Name</th>
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest text-center">Postings</th>
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest text-center">Consistency</th>
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest">First BD</th>
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest">Last BD</th>
              <th className="p-5 text-[0.625rem] font-black uppercase text-on-surface-variant tracking-widest">Awards</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {paginatedPax.map((p) => (
              <tr
                key={p.name}
                onClick={() => onPaxClick(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPaxClick(p);
                  }
                }}
                role="button"
                tabIndex={0}
                className="bg-surface-container-low hover:bg-surface-container-high transition-colors group cursor-pointer outline-none focus:bg-surface-container-highest"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-primary group-hover:border-primary transition-colors">
                      {p.name[0]}
                    </div>
                    <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</span>
                  </div>
                </td>
                <td className="p-5 font-black text-on-surface text-center">{p.posts}</td>
                <td className="p-5 text-center">
                  <span className={`text-xs font-bold ${p.consistency > 50 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {p.consistency}%
                  </span>
                </td>
                <td className="p-5 text-xs text-on-surface-variant font-medium">{p.firstBD}</td>
                <td className="p-5 text-xs text-on-surface-variant font-medium">{p.lastBD}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    {p.awards.map(a => (
                      <span key={a} className="grayscale hover:grayscale-0 transition-all cursor-help" title={a}>
                        {getAwardIcon(a) !== '👕' ? getAwardIcon(a) : (
                          <span className="relative inline-block">
                            {getAwardIcon(a)}
                            {getAwardLabel(a) && (
                              <span className="absolute -top-1 -right-1 bg-primary text-[0.5rem] text-on-primary font-black px-0.5 rounded-sm leading-none">
                                {getAwardLabel(a)}
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
        <div className="md:hidden divide-y divide-outline-variant/10">
          {paginatedPax.map((p) => (
            <div
              key={p.name}
              onClick={() => onPaxClick(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPaxClick(p);
                }
              }}
              role="button"
              tabIndex={0}
              className="p-4 bg-surface-container-low hover:bg-surface-container-high active:bg-surface-container-highest transition-colors flex items-center justify-between group cursor-pointer outline-none focus:bg-surface-container-highest"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-lg font-black text-primary group-active:scale-95 transition-transform">
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-bold text-on-surface">{p.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="text-[0.625rem] text-on-surface-variant font-bold uppercase tracking-widest">Last: {p.lastBD}</div>
                    <div className="flex gap-1">
                      {p.awards.map(a => (
                        <span key={a} className="text-xs">
                          {getAwardIcon(a)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {p.awards.some(a => a.toLowerCase().startsWith('shirt')) && (
                  <span className="text-[0.5625rem] font-black text-primary border border-primary/30 bg-primary/10 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Centurion</span>
                )}
                <div className="flex flex-col items-end">
                  <div className="text-lg font-black text-primary">{p.posts}</div>
                  <div className="text-[0.625rem] font-bold text-on-surface-variant uppercase">Postings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-surface-container border border-outline-variant/20 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Showing <span className="text-on-surface">{startIndex + 1}</span> to <span className="text-on-surface">{Math.min(startIndex + ITEMS_PER_PAGE, filteredPax.length)}</span> of <span className="text-primary">{filteredPax.length}</span> PAX
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-surface-container-highest border border-outline-variant/30 rounded-xl text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-sm font-black text-on-surface bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20">
              PAGE {currentPage} <span className="text-on-surface-variant mx-1">/</span> {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-surface-container-highest border border-outline-variant/30 rounded-xl text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};