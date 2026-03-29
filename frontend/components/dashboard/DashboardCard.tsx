import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/10',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/10',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
    red: 'bg-red-500/10 text-red-400 border-red-500/10',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 rounded-[2rem] flex flex-col justify-between group h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <Icon size={120} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.purple}`}>
          <Icon size={24} />
        </div>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>

      <div>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{title}</p>
        <div className="flex items-baseline gap-2">
           <h3 className="text-4xl font-black tracking-tighter gradient-text leading-none">{value}</h3>
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">+8.2%</span>
        </div>
      </div>
    </motion.div>
  );
};
