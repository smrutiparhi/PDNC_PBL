import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TerminalLogsProps {
  logs: string[];
  progress: number;
  isAnalyzing: boolean;
  hasResults: boolean;
}

export default function TerminalLogs({ logs, progress, isAnalyzing, hasResults }: TerminalLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl flex flex-col h-full min-h-[300px] overflow-hidden shadow-2xl relative group">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/50 flex justify-between items-center z-10 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">
            Pipeline Console
          </h2>
        </div>
        
        {/* Progress Ring / Status indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">
            {isAnalyzing ? "Processing..." : hasResults ? "Complete" : "Standing By"}
          </span>
          <div className="relative w-8 h-8 flex items-center justify-center bg-black rounded-full border border-zinc-800">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="14" fill="transparent" strokeWidth="2" stroke="#1f2937" />
              <circle 
                cx="16" cy="16" r="14" 
                fill="transparent" 
                strokeWidth="2" 
                stroke={hasResults ? '#10b981' : '#34d399'} 
                strokeDasharray="88" 
                strokeDashoffset={88 - (88 * progress) / 100}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <span className="absolute text-[8px] font-mono font-bold text-zinc-300">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Logs View */}
      <div className="p-5 font-mono text-[11px] leading-relaxed flex-1 overflow-y-auto bg-black border-y border-zinc-800">
        {!isAnalyzing && logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
            <Terminal className="w-8 h-8 opacity-20" />
            <span className="italic">Awaiting tensor input data...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex font-medium items-start gap-3",
                  (i === logs.length - 1 && isAnalyzing) ? "text-emerald-400 animate-pulse" : "text-zinc-400"
                )}
              >
                <span className="text-zinc-600 min-w-[60px] select-none block shrink-0">
                  {`>_`}
                </span>
                <span className="break-words w-full">{log}</span>
              </motion.div>
            ))}
            <div ref={logsEndRef} className="h-1 text-transparent" />
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="h-1.5 w-full bg-zinc-900 absolute bottom-0">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 shadow-[0_0_15px_#34d399]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
