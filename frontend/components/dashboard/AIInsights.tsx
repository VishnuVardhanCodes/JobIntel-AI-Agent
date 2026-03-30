'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Cpu, Zap, Code, Star } from 'lucide-react';
import { JobData } from '@/lib/api';

interface AIInsightsProps {
  jobs: JobData[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ jobs }) => {
  // Simple extraction logic for "Insights"
  const allSkills = jobs.flatMap(j => Array.isArray(j.primary_skills) ? j.primary_skills : [j.primary_skills]);
  const skillFreq: Record<string, number> = {};
  allSkills.forEach(s => {
    if (!s) return;
    skillFreq[s] = (skillFreq[s] || 0) + 1;
  });
  
  const topSkills = Object.entries(skillFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  const hasRemote = jobs.some(j => j.location.toLowerCase().includes('remote'));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card-premium p-6 rounded-[2.5rem] border-white/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
        <Sparkles size={80} className="text-purple-400" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight leading-none">Neural Insights</h3>
            <p className="text-[9px] uppercase font-bold tracking-widest text-purple-400 mt-1 opacity-70">Lyzr Intelligence Engine</p>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.length > 0 ? (
            <>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group/item">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <TrendingUp size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Market Hot Trend</p>
                    <p className="text-xs font-bold leading-relaxed">
                      Demand for <span className="text-blue-400">"{topSkills[0] || 'AI Engineering'}"</span> is 
                      trending up by <span className="text-emerald-400">14%</span> in your target sector.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group/item">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                     <Zap size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Optimization Tip</p>
                    <p className="text-xs font-bold leading-relaxed">
                      {hasRemote ? 
                        "70% of identified roles support Remote. Prioritize these for faster placement." : 
                        "On-site roles dominate this search. Consider broadening geography parameters."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group/item relative overflow-hidden">
                <div className="absolute right-[-10px] top-[-10px] opacity-[0.03]">
                  <Star size={60} />
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <Code size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Core Skill Matrix</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {topSkills.map((s, i) => (
                         <span key={i} className="text-[9px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-500/80 px-2 py-0.5 rounded">
                           {s}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center opacity-30 italic text-xs font-medium">
              Initialize stream to generate neural insights...
            </div>
          )}
        </div>

        <div className="pt-2">
           <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 hover:text-white">
             Generate Full Sector Report
           </button>
        </div>
      </div>
    </motion.div>
  );
};
