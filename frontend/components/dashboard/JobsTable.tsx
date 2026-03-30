import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  MapPin, 
  Building2, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  ExternalLink,
  Target,
  Sparkles,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobData } from '@/lib/api';
import { toast } from 'sonner';

interface JobsTableProps {
  jobs: JobData[];
}

export const JobsTable: React.FC<JobsTableProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredJobs = jobs.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h3 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
             <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <LayoutGrid className="text-purple-400" size={20} />
             </div>
             Intelligence Stream
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-12">
            Captured {filteredJobs.length} specialized roles
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Filter the neural stream..."
                className="bg-white/5 border border-white/5 focus:border-purple-500/40 pl-12 pr-4 py-3 text-sm w-full rounded-2xl outline-none transition-all focus:bg-white/[0.08]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[10px] font-black w-8 text-center">{currentPage}/{Math.max(1, totalPages)}</span>
              <button 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 disabled={currentPage === totalPages}
                 className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {currentJobs.length > 0 ? currentJobs.map((job, idx) => (
            <motion.div 
              key={job.role + job.company_name + idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="glass-card-premium p-6 rounded-[2rem] flex flex-col gap-5 group cursor-default hover:border-purple-500/30"
            >
              <div className="scan-line" />
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-indigo-400">
                      <Building2 size={12} className="opacity-50" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]">{job.company_name}</span>
                   </div>
                   <h4 className="text-lg font-bold tracking-tight leading-tight group-hover:text-purple-400 transition-colors uppercase">
                      {job.role}
                   </h4>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                   <Target size={18} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                    <MapPin size={12} className="text-rose-500/70" />
                    <span className="text-[10px] font-bold">{job.location}</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                    <Briefcase size={12} className="text-blue-400/70" />
                    <span className="text-[10px] font-bold tracking-tighter">{job.years_of_experience} EXP</span>
                 </div>
              </div>

              <div className="flex flex-wrap gap-2">
                 {(Array.isArray(job.primary_skills) ? job.primary_skills : [job.primary_skills]).slice(0, 3).map((skill, si) => (
                    <span key={si} className="px-2.5 py-1 rounded-md bg-purple-500/5 text-purple-400/80 text-[8px] font-black uppercase tracking-wider border border-purple-500/10 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                      {skill}
                    </span>
                 ))}
              </div>

              <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full border-2 border-[#030303] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[8px] font-black">AI</div>
                    <div className="w-7 h-7 rounded-full border-2 border-[#030303] bg-emerald-500/20 flex items-center justify-center">
                       <Sparkles size={10} className="text-emerald-400" />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <button 
                       onClick={() => copyToClipboard(job.role + " @ " + job.company_name)}
                       className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
                       title="Copy Details"
                    >
                       <Link2 size={14} />
                    </button>
                    <a 
                       href={`mailto:${job.email}`}
                       className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:shadow-purple-500/25"
                    >
                       <Mail size={14} />
                       Contact
                    </a>
                 </div>
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 flex flex-col items-center gap-8 glass-card rounded-[3rem] border-white/5"
            >
               <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                  <div className="relative bg-white/[0.03] p-12 rounded-full border border-white/5 animate-pulse-slow">
                    <Search size={64} className="text-purple-400/40" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h4 className="text-3xl font-black tracking-tighter text-white opacity-80 uppercase">Neural Stream Empty</h4>
                  <p className="text-sm font-medium text-muted-foreground tracking-wide opacity-40">The JobIntel.AI autonomous agent is standing by.<br/>Initialize a target role to begin the extraction sequence.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredJobs.length > 0 && (
         <div className="flex items-center justify-between px-4 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
               Page {currentPage} of {totalPages} — {filteredJobs.length} synchronized entries
            </p>
            <div className="flex gap-1.5">
               {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-purple-500' : 'bg-white/10 hover:bg-white/20'}`}
                  />
               ))}
            </div>
         </div>
      )}
    </motion.div>
  );
};
