import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldCheck, Cpu, LayoutGrid, Layers, Database, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  icon?: React.ReactNode;
}

interface ConsoleProps {
  status: string;
  keyword?: string;
}

export const Console: React.FC<ConsoleProps> = ({ status, keyword }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info', icon?: React.ReactNode) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type,
      icon,
    };
    setLogs(prev => [...prev.slice(-99), newLog]);
  };

  useEffect(() => {
    if (status === 'Running') {
      addLog(`⚡ DISPATCHING NEURAL AGENT: "${keyword?.toUpperCase()}"`, 'ai', <Cpu size={14} />);
      addLog('📡 CONNECTING TO UPSTREAM JOB AGGREGATORS...', 'info', <Layers size={14} />);
      
      const sequence = [
        { msg: '✅ SYNCED WITH REMOTIVE DATA LAKE', type: 'success' },
        { msg: '🧠 INITIALIZING LLAMA-3.1-8B EXTRACTION LAYER', type: 'ai' },
        { msg: '🛡️ QDRANT VECTOR MATCHING ENABLED', type: 'success', icon: <ShieldCheck size={14}/> },
        { msg: '📥 PARSING UNSTRUCTURED JOB DATA...', type: 'info' },
        { msg: '💾 COMMITING TO SHARED WORKSPACE', type: 'success' },
        { msg: '🎯 ORCHESTRATION COMPLETE. STREAMING RESULTS.', type: 'ai' }
      ];

      sequence.forEach((s, i) => {
        setTimeout(() => {
          // @ts-ignore
          addLog(s.msg, s.type, s.icon);
        }, (i + 1) * 1200);
      });
    } else if (status === 'Online') {
      addLog('💡 CORE SYSTEMS ONLINE. AWAITING INSTRUCTION.', 'info', <Activity size={14} />);
    }
  }, [status, keyword]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className="glass-card-premium rounded-[2.5rem] overflow-hidden flex flex-col h-[400px] border-white/5 shadow-2xl relative">
      <div className="scan-line opacity-20" />
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50 border border-rose-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50 border border-amber-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 border border-emerald-500/20" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-2">Mainframe_Console.v2</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
           <Database size={12} className="text-purple-400 animate-pulse" />
           <span className="text-[9px] uppercase font-black tracking-widest text-purple-400/80">Lyzr Logic Core</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 font-mono text-[11px] overflow-y-auto scrollbar-thin bg-black/40 relative z-10 selection:bg-purple-500/30"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-3 flex items-start gap-4 transition-all ${
                log.type === 'ai' ? 'text-purple-400 font-bold' : 
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'error' ? 'text-rose-400' : 'text-blue-300'
              }`}
            >
              <span className="opacity-20 whitespace-nowrap font-bold">[{log.timestamp}]</span>
              <span className="flex items-center gap-3">
                <div className="opacity-40">{log.icon || <div className="w-3.5" />}</div>
                <span className="leading-relaxed tracking-tight">{log.message}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Status */}
      {status === 'Running' ? (
        <div className="h-1.5 bg-white/5 relative z-20">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      ) : (
        <div className="px-6 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between relative z-20">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60">System Ready</span>
           </div>
           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">Buffer: 99+ entries</span>
        </div>
      )}
    </div>
  );
};
