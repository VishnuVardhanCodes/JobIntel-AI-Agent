import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030303] pointer-events-none">
      {/* Dynamic Animated Blobs */}
      <motion.div 
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full"
      />
      
      <motion.div 
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 120, -100, 0],
          scale: [1, 1.1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] bg-indigo-600/10 blur-[150px] rounded-full"
      />

      <motion.div 
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full"
      />

      {/* Noise Texture Overlay */}
      <div className="noise-bg" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#030303]" />
    </div>
  );
};
