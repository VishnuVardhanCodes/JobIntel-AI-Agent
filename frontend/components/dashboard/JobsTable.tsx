import React, { useState } from 'react';
import { Search, Mail, MapPin, Building2, Briefcase, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobData } from '@/lib/api';

interface JobsTableProps {
  jobs: JobData[];
}

export const JobsTable: React.FC<JobsTableProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredJobs = jobs.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] border-white/5 shadow-2xl"
    >
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <LayoutGrid className="text-purple-400" size={20} />
          Intelligence Stream
        </h3>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Filter results..."
            className="bg-white/5 border border-white/5 focus:border-purple-500/30 pl-12 pr-4 py-2.5 text-sm w-full md:w-64 rounded-xl outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.02] text-muted-foreground text-[10px] uppercase tracking-widest font-black sticky top-0 z-10">
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Organization</th>
              <th className="px-8 py-5">Geography</th>
              <th className="px-8 py-5">Core Stack</th>
              <th className="px-8 py-5">Experience</th>
              <th className="px-8 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="popLayout">
              {currentJobs.length > 0 ? currentJobs.map((job, idx) => (
                <motion.tr 
                  key={job.role + job.company_name + idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="px-8 py-6 font-bold text-sm tracking-tight group-hover:text-purple-400 transition-colors">{job.role}</td>
                  <td className="px-8 py-6 text-sm font-medium text-indigo-200 opacity-80">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="opacity-30" />
                      {job.company_name}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="opacity-30 text-rose-500" />
                      {job.location}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(job.primary_skills) ? job.primary_skills : [job.primary_skills]).slice(0, 2).map((skill, si) => (
                        <span key={si} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase tracking-wider border border-purple-500/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black font-mono text-emerald-400 tracking-tighter uppercase">{job.years_of_experience}</td>
                  <td className="px-8 py-6">
                     <a href={`mailto:${job.email}`} className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all group/mail">
                      <Mail size={16} className="group-hover/mail:scale-110 transition-transform" />
                     </a>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                     <div className="flex flex-col items-center gap-6 opacity-40 select-none grayscale group-hover:grayscale-0 transition-all">
                        <div className="bg-white/[0.03] p-8 rounded-full border border-white/5 animate-pulse-slow">
                          <Search size={54} className="text-purple-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-black tracking-tighter text-white">Neural Stream Empty</p>
                          <p className="text-sm font-medium text-muted-foreground">The agent is standing by. Engage search to begin extraction.</p>
                        </div>
                     </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
          <span className="text-white bg-white/10 px-2 py-1 rounded-md">{Math.min(startIndex + 1, filteredJobs.length)}</span>
          <span>to</span>
          <span className="text-white bg-white/10 px-2 py-1 rounded-md">{Math.min(startIndex + itemsPerPage, filteredJobs.length)}</span>
          <span className="mx-1 opacity-20">/</span>
          <span>Total Result: {filteredJobs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 transition-all hover:scale-105"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
             disabled={currentPage === totalPages}
             className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 transition-all hover:scale-105"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
