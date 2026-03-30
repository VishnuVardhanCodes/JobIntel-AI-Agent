'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Activity, 
  Briefcase, 
  Globe, 
  Database, 
  Terminal,
  Cpu,
  Zap,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { 
  getJobs, 
  getStatus, 
  runAgent, 
  JobData, 
  AgentStatus, 
  MOCK_STATUS 
} from '@/lib/api';

import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatusPanel } from '@/components/dashboard/StatusPanel';
import { JobsTable } from '@/components/dashboard/JobsTable';
import { Loader } from '@/components/dashboard/Loader';
import { Console } from '@/components/dashboard/Console';
import { AIInsights } from '@/components/dashboard/AIInsights';

export default function Dashboard() {
  const [keyword, setKeyword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(false); 
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [status, setStatus] = useState<AgentStatus>(MOCK_STATUS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, [demoMode]);

  const fetchData = async () => {
    try {
      const [jobsData, statusData] = await Promise.all([
        getJobs(demoMode),
        getStatus(demoMode)
      ]);
      setJobs(jobsData);
      setStatus(statusData);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    }
  };

  const handleRunAgent = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a job keyword first!");
      return;
    }

    setIsProcessing(true);
    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        toast.success("Simulation sequence finalized.");
      } else {
        await runAgent(keyword);
        toast.info(`Neural dispatch initialized for "${keyword.toUpperCase()}"`);
        
        let attempts = 0;
        const checkDone = setInterval(async () => {
          attempts++;
          const currentStatus = await getStatus(false);
          if (currentStatus.status === 'Online' || attempts > 30) {
            clearInterval(checkDone);
            await fetchData();
            setIsProcessing(false);
            if (jobs.length > 0) {
              toast.success(`Success: ${jobs.length} roles synchronized to Google Sheets.`);
            } else if (attempts <= 30) {
              toast.warning("Zero matches detected in current stream.");
            }
          }
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.message || "Engine failure — retry required");
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 md:p-12 flex flex-col gap-12 max-w-[1400px] mx-auto text-white selection:bg-purple-500/30 relative z-10"
    >
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center"
          >
             <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative"
        >
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/10">
                   <Terminal size={32} className="text-white" />
                </div>
             </div>
             <div>
                <h1 className="text-6xl font-black tracking-tighter gradient-text leading-none py-2">JobIntel.AI</h1>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 opacity-80">Orchestrated by Lyzr Automata</span>
                   <div className="h-px w-8 bg-purple-500/30" />
                   <Sparkles size={12} className="text-purple-400 animate-pulse" />
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 p-1.5 bg-white/[0.03] rounded-[1.5rem] border border-white/5 backdrop-blur-2xl shadow-xl"
        >
           <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${
             status.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-purple-500/5 text-purple-400 border-purple-500/10'
           }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${status.status === 'Running' ? 'bg-emerald-400 animate-ping' : 'bg-purple-400/50'}`} />
              {status.status === 'Running' ? 'Neural Link Active' : 'System Standby'}
           </div>
           
           <button 
              onClick={() => setDemoMode(!demoMode)}
              className={`text-[10px] font-black uppercase tracking-[0.25em] px-6 py-3 rounded-2xl transition-all border duration-500 ${demoMode ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10'}`}
           >
              {demoMode ? 'PROD: SIMULATION' : 'PROD: LIVE STREAM'}
           </button>
        </motion.div>
      </header>

      {/* Main Search Component */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="glass-card-premium p-8 md:p-10 rounded-[3rem] flex flex-col lg:flex-row gap-8 items-center border-white/10 hover:border-purple-500/40 transition-all duration-1000 group shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
      >
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-purple-400 transition-colors duration-500" size={28} />
            <input 
               type="text" 
               placeholder="Initialize target role (e.g. Lead Generative AI Architect)..."
               className="bg-white/[0.03] border border-white/5 focus:bg-white/[0.07] focus:border-purple-500/50 w-full pl-20 pr-10 py-7 text-2xl font-black tracking-tight rounded-[2rem] transition-all outline-none placeholder:text-muted-foreground/20 placeholder:font-bold"
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleRunAgent()}
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-all duration-500 flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
               <span className="text-[11px] uppercase font-black text-purple-400 tracking-[0.3em]">Lyzr Core Linked</span>
            </div>
         </div>
         <button 
            onClick={handleRunAgent}
            disabled={isProcessing}
            className="premium-button flex items-center justify-center gap-4 w-full lg:w-auto h-[84px] lg:min-w-[320px] text-2xl uppercase tracking-tighter disabled:opacity-50 group/btn"
         >
            <div className="relative">
               <Zap size={28} className="fill-white group-hover/btn:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-white blur-xl opacity-0 group-hover/btn:opacity-30 transition-opacity" />
            </div>
            <span>Engage Agent</span>
         </button>
      </motion.section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 items-start">
        
        <div className="lg:col-span-8 space-y-10">
           {/* Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title="Total Captured" value={status.total_jobs} icon={Briefcase} color="blue" delay={1} />
              <DashboardCard title="Neural Verified" value={status.unique_jobs} icon={Globe} color="indigo" delay={2} />
              <DashboardCard title="Duplicates Purged" value={status.duplicates_skipped} icon={ShieldAlert} color="red" delay={3} />
           </div>

           {/* Table/Cards Grid */}
           <JobsTable jobs={jobs} />

           {/* Tech Stack Pills */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Vector Memory", val: "Qdrant DB", icon: Database, color: "blue" },
                { title: "Intelligence", val: "Llama-3.1-8B", icon: Cpu, color: "purple" },
                { title: "Orchestration", val: "Lyzr Automata", icon: Layers, color: "indigo" }
              ].map((item, i) => (
                <div key={i} className="glass-card-premium p-6 rounded-[2rem] flex items-center gap-5 group border-white/5 hover:bg-white/[0.05]">
                  <div className={`p-4 bg-${item.color}-500/10 rounded-2xl text-${item.color}-400 border border-${item.color}-500/10 transform group-hover:rotate-[360deg] transition-transform duration-1000`}>
                     <item.icon size={28} />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1 opacity-50">{item.title}</h4>
                     <p className="text-lg font-black tracking-tighter">{item.val}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar/Command Center */}
        <aside className="lg:col-span-4 space-y-10 sticky top-12">
           <Console status={status.status} keyword={keyword} />
           <AIInsights jobs={jobs} />
           <StatusPanel status={status} />
        </aside>

      </div>

      {/* Futuristic Footer */}
      <footer className="mt-12 border-t border-white/10 pt-16 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
         
         <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black gradient-text tracking-tighter">JobIntel.AI</h2>
               <div className="h-4 w-px bg-white/20" />
               <span className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase">v2.0 Hackathon Build</span>
            </div>
            <p className="text-xs text-muted-foreground font-bold leading-relaxed opacity-50 uppercase tracking-widest">
              Autonomous job market orchestration engine. Utilizing multi-agent systems via Lyzr SDK and high-performance vector deduplication.
            </p>
         </div>

         <div className="flex items-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <img src="/lyzr-logo.png" alt="Lyzr" className="h-8" />
            <img src="/groq-logo.png" alt="Groq AI" className="h-6" />
            <img src="/qdrant-logo.png" alt="Qdrant" className="h-7" />
         </div>
      </footer>
     </motion.div>
  );
}
