import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Processing Jobs..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card p-10 rounded-3xl flex flex-col items-center gap-6 max-w-sm w-full animate-float">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
          <Loader2 className="animate-spin text-purple-500 relative z-10" size={60} strokeWidth={2.5} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold gradient-text">{message}</h3>
          <p className="text-sm text-muted-foreground italic">"Orchestrating Lyzr Agents & Data Pipeline..."</p>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
          <div className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-pulse origin-left scale-x-75" />
        </div>
      </div>
    </div>
  );
};
