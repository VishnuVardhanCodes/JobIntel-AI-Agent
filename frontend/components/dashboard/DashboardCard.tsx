import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/10 shadow-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/10 shadow-purple-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10 shadow-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10 shadow-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/10 shadow-red-500/20',
  };

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.8, ease: "easeOut" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card-premium p-6 rounded-[2.5rem] flex flex-col justify-between group h-full relative overflow-hidden"
    >
      {/* Background Icon */}
      <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
        <Icon size={160} strokeWidth={1} />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.1), transparent 40%)`
          ),
        }}
      />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.div 
          animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
          className={`p-4 rounded-2xl shadow-lg border transition-colors duration-500 ${colorMap[color] || colorMap.purple}`}
        >
          <Icon size={24} />
        </motion.div>
        
        <div className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/80">Active</span>
        </div>
      </div>

      <div className="relative z-10">
        <motion.p 
          animate={isHovered ? { x: 5 } : { x: 0 }}
          className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60 group-hover:opacity-100 transition-all"
        >
          {title}
        </motion.p>
        <div className="flex items-end gap-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
           <h3 className="text-5xl font-black tracking-tighter gradient-text leading-none select-none">
             {value}
           </h3>
           <motion.div 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col mb-1"
           >
              <span className="text-[10px] font-black text-emerald-400 leading-none">↑ 12%</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Vs last</span>
           </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};
