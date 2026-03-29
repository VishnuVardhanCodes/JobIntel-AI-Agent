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

export default function Dashboard() {
  const [keyword, setKeyword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // Default to Real Data for Hackathon
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [status, setStatus] = useState<AgentStatus>(MOCK_STATUS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 5000); // Faster refresh for real-time feel
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
        toast.success("Demo Agent Finished Successfully!");
      } else {
        await runAgent(keyword);
        toast.info(`Agent dispatched for "${keyword.toUpperCase()}"...`);
        
        // Polling loop for active feedback
        let attempts = 0;
        const checkDone = setInterval(async () => {
          attempts++;
          const currentStatus = await getStatus(false);
          if (currentStatus.status === 'Online' || attempts > 30) {
            clearInterval(checkDone);
            await fetchData();
            setIsProcessing(false);
            if (jobs.length > 0) {
              toast.success(`Pipeline success! ${jobs.length} roles captured and synced to Sheets.`);
            } else if (attempts <= 30) {
              toast.warning("No new matching jobs found for this criteria.");
            }
          }
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.message || "Agent Failed — Try Again");
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto text-white/90 selection:bg-purple-500/30"
    >
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center"
          >
             <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-4">
             <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <Terminal size={28} className="text-white" />
             </div>
             <div>
                <h1 className="text-5xl font-black tracking-tighter gradient-text leading-none">JobIntel AI</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400 mt-1 opacity-80">Orchestrated by Lyzr AI</p>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/5 backdrop-blur-xl"
        >
           <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
             status.status === 'Running' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-purple-500/10 text-purple-400 border-purple-500/10'
           }`}>
              <div className={`w-2 h-2 rounded-full ${status.status === 'Running' ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400 opacity-50'}`} />
              {status.status === 'Running' ? 'Agent Active' : 'Standby'}
           </div>
           
           <button 
              onClick={() => setDemoMode(!demoMode)}
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all border ${demoMode ? 'bg-purple-600 text-white border-purple-500 shadow-lg' : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10'}`}
           >
              {demoMode ? 'Demo: Simulation' : 'Live Data Stream'}
           </button>
        </motion.div>
      </header>

      {/* Impact Search Bar */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center border-white/10 hover:border-purple-500/30 transition-all duration-700 group shadow-2xl"
      >
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={24} />
            <input 
               type="text" 
               placeholder="Enter target job role (e.g. Artificial Intelligence Intern)..."
               className="bg-white/5 border border-white/5 focus:bg-white/10 focus:border-purple-500/40 w-full pl-16 pr-8 py-5 text-xl font-semibold rounded-[1.5rem] transition-all outline-none placeholder:text-muted-foreground/40"
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleRunAgent()}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-2">
               <span className="text-[10px] uppercase font-black text-purple-400 tracking-widest">Lyzr Logic Enabled</span>
               <Sparkles size={14} className="text-purple-400 animate-pulse" />
            </div>
         </div>
         <button 
            onClick={handleRunAgent}
            disabled={isProcessing}
            className="premium-button flex items-center justify-center gap-3 w-full md:w-auto h-[68px] md:min-w-[240px] text-xl disabled:opacity-50"
         >
            <Zap size={24} className="fill-white" />
            <span>Engage Agent</span>
         </button>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
        
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title="Total Jobs Found" value={status.total_jobs} icon={Briefcase} color="blue" delay={1} />
              <DashboardCard title="Verified Results" value={status.unique_jobs} icon={Globe} color="indigo" delay={2} />
              <DashboardCard title="Duplicates Skp" value={status.duplicates_skipped} icon={ShieldAlert} color="red" delay={3} />
           </div>

           <JobsTable jobs={jobs} />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-3xl flex items-center gap-4 group">
                 <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/10 transform group-hover:rotate-12 transition-transform capitalize">
                    <Database size={24} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-0.5">Vector Memory</h4>
                    <p className="text-sm font-bold">Qdrant DB Connected</p>
                 </div>
              </div>
              <div className="glass-card p-5 rounded-3xl flex items-center gap-4 group border-purple-500/10">
                 <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/10 transform group-hover:rotate-12 transition-transform">
                    <Cpu size={24} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-0.5">Extraction Model</h4>
                    <p className="text-sm font-bold">Groq Llama-3.1-8B</p>
                 </div>
              </div>
              <div className="glass-card p-5 rounded-3xl flex items-center gap-4 group">
                 <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/10 transform group-hover:rotate-12 transition-transform">
                    <Layers size={24} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-0.5">Logic Layer</h4>
                    <p className="text-sm font-bold">Lyzr Automata SDK</p>
                 </div>
              </div>
           </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
           <Console status={status.status} keyword={keyword} />
           <StatusPanel status={status} />
        </aside>

      </div>

      <footer className="mt-8 border-t border-white/5 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px]">
               <span className="text-purple-500">JobIntel AI Agent</span>
               <span className="opacity-20">|</span>
               <span className="text-muted-foreground">Hackathon Edition 2.0</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium max-w-[300px] leading-relaxed opacity-60">
              Autonomous job market intelligence platform leveraging multi-agent orchestration via Lyzr and vector-based de-duplication with Qdrant.
            </p>
         </div>

         <div className="flex items-center gap-8 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <img src="/lyzr-logo.png" alt="Lyzr" className="h-6" />
            <img src="/groq-logo.png" alt="Groq AI" className="h-4" />
            <img src="/qdrant-logo.png" alt="Qdrant" className="h-5" />
         </div>
      </footer>
    </motion.div>
  );
}
