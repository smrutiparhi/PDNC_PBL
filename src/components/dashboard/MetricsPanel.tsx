import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '../../utils/cn';

interface MetricsPanelProps {
  score: number;
  ssim: number;
  psnr: number;
  threshold: number;
  isAnomaly: boolean;
}

// Simple internal animated counter
const AnimatedCounter = ({ value, prefix = "", suffix = "", decimals = 2, className = "" }: { value: number, prefix?: string, suffix?: string, decimals?: number, className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // ms
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(startValue + progress * (value - startValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span className={className}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

export default function MetricsPanel({ score, ssim, psnr, threshold, isAnomaly }: MetricsPanelProps) {
  // Generate mock sparkline data around the final score for visualization
  const mockSparkData = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      val: score * (0.8 + Math.random() * 0.4) // Wiggle around the actual score
    })).concat([{ val: score }]); // Ensure last point is the exact score
  }, [score]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric Card 1: MSE */}
      <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/80 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest font-semibold">MSE Score</div>
        <AnimatedCounter value={score} decimals={4} className="font-mono text-3xl font-bold text-zinc-100 block mb-1" />
        <div className="text-xs text-zinc-500">Mean Squared Error</div>
        
        {/* Background Sparkline */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSparkData}>
              <Area type="monotone" dataKey="val" stroke="#10b981" fill="#10b981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Metric Card 2: SSIM */}
      <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/80 shadow-lg group hover:border-zinc-700 transition-colors">
        <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest font-semibold flex justify-between">
          <span>SSIM Index</span>
          <span className="text-emerald-500">&gt;0.9</span>
        </div>
        <AnimatedCounter value={ssim} decimals={4} className="font-mono text-3xl font-bold text-zinc-100 block mb-1" />
        <div className="text-xs text-zinc-500">Structural Similarity</div>
      </div>

      {/* Metric Card 3: PSNR */}
      <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/80 shadow-lg group hover:border-zinc-700 transition-colors">
        <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-widest font-semibold">Peak SNR</div>
        <AnimatedCounter value={psnr} decimals={2} suffix=" dB" className="font-mono text-3xl font-bold text-zinc-100 block mb-1" />
        <div className="text-xs text-zinc-500">Signal-to-Noise Ratio</div>
      </div>

      {/* Metric Card 4: Delta (Highlighted) */}
      <div className={cn(
        "rounded-2xl p-5 shadow-lg flex flex-col justify-center border transition-all duration-500",
        isAnomaly 
          ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] hover:border-rose-500/50" 
          : "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-500/50"
      )}>
        <div className={cn(
          "text-[10px] font-mono mb-2 uppercase tracking-widest font-bold",
          isAnomaly ? "text-rose-500" : "text-emerald-500"
        )}>
          Confidence Margin
        </div>
        <AnimatedCounter 
          value={Math.abs(score - threshold)} 
          decimals={5} 
          prefix={score > threshold ? "+" : "-"} 
          className={cn(
            "font-mono text-3xl font-bold block mb-1 tracking-tight",
            isAnomaly ? "text-rose-400" : "text-emerald-400"
          )} 
        />
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-zinc-500 font-medium">Delta vs Threshold</span>
          <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700/50">
            {threshold.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
