//import React from 'react';
import type { PaxData } from '../types';

export const RosterView = ({ filteredPax, onPaxClick }: { filteredPax: PaxData[], onPaxClick: (pax: PaxData) => void }) => (
  <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl mb-24 lg:mb-0">
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
        {filteredPax.map((p) => (
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
                    {a.startsWith('Cindy') ? '🧱' : a.startsWith('Mug') ? '☕' : '👕'}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile Card View - Better for small screens */}
    <div className="md:hidden divide-y divide-zinc-900">
      {filteredPax.map((p) => (
        <div
          key={p.name}
          onClick={() => onPaxClick(p)}
          className="p-5 hover:bg-zinc-900/20 active:bg-zinc-900/40 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-yellow-400">
              {p.name[0]}
            </div>
            <div>
              <div className="font-bold text-white">{p.name}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Last: {p.lastBD}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-yellow-400">{p.posts}</div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase">Posts</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);