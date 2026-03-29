import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldCheck, Cpu, LayoutGrid, Layers, Database } from 'lucide-react';
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
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      icon,
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  useEffect(() => {
    if (status === 'Running') {
      addLog(`⚡ DISPATCHING AGENT FOR: "${keyword?.toUpperCase()}"`, 'ai', <Cpu size={14} />);
      addLog('📡 CONNECTING TO REMOTIVE API...', 'info', <Layers size={14} />);
      
      const sequence = [
        { msg: '✅ FETCHED JOB POSTINGS FROM REMOTE SOURCES', type: 'success' },
        { msg: '🧠 INITIALIZING LLAMA-3.1 ANALYSIS ENGINE', type: 'ai' },
        { msg: '🛡️ DUPLICATE DETECTION LAYER ACTIVE', type: 'success', icon: <ShieldCheck size={14}/> },
        { msg: '📥 EXTRACTING STRUCTURED DATA...', type: 'info' },
        { msg: '💾 SYNCING WITH GOOGLE SHEETS...', type: 'success' },
        { msg: '🎯 PIPELINE OPTIMIZED. RESULTS READY.', type: 'ai' }
      ];

      sequence.forEach((s, i) => {
        setTimeout(() => {
          // @ts-ignore
          addLog(s.msg, s.type, s.icon);
        }, (i + 1) * 800);
      });
    } else if (status === 'Online') {
      addLog('💡 SYSTEM READY. AWAITING COMMAND.', 'info', <Terminal size={14} />);
    }
  }, [status, keyword]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-[350px] border-white/5 shadow-2xl">
      <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">JobIntel_AI_Console.log</span>
        </div>
        <div className="flex items-center gap-1 opacity-50">
           <Database size={12} className="text-purple-400" />
           <span className="text-[10px] uppercase font-bold">V-SYNC: ON</span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[11px] overflow-y-auto scrollbar-thin bg-black/40"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-2 flex items-start gap-3 ${
                log.type === 'ai' ? 'text-purple-400' : 
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'error' ? 'text-red-400' : 'text-blue-300'
              }`}
            >
              <span className="opacity-30 whitespace-nowrap">[{log.timestamp}]</span>
              <span className="flex items-center gap-2">
                {log.icon}
                <span className="leading-relaxed">{log.message}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {status === 'Running' && (
        <div className="h-1 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500 glow-purple"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
};
