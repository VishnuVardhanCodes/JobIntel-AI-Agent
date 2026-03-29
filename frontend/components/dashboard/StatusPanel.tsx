import React from 'react';
import { Activity, Clock, Database, Cpu } from 'lucide-react';
import { AgentStatus } from '@/lib/api';

interface StatusPanelProps {
  status: AgentStatus;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ status }) => {
  const items = [
    { label: 'Agent Status', value: status.status, icon: Activity, color: 'emerald' },
    { label: 'Last Run Time', value: status.last_run_time, icon: Clock, color: 'blue' },
    { label: 'Jobs Processed', value: status.jobs_processed, icon: Database, color: 'purple' },
    { label: 'Memory Status', value: status.memory_status, icon: Cpu, color: 'indigo' },
  ];

  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col gap-6">
      <h3 className="text-xl font-bold gradient-text">System Intelligence</h3>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="group cursor-default">
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-2 rounded-lg bg-${item.color}-500/10 text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                <item.icon size={18} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            </div>
            <p className="text-lg font-semibold pl-12">{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground uppercase tracking-widest font-bold">Optimization</span>
            <span className="text-emerald-400 font-mono">98%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[98%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
