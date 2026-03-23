import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';

export default function DemoShowcase() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleDrag);
    }, { once: true });
  };

  const handleTouchStart = () => {
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleDrag);
    }, { once: true });
  };

  // Generate an abstract placeholder image URL
  const baseImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";

  return (
    <section id="demo" className="py-24 bg-transparent relative text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-500 tracking-tight mb-4"
          >
            Instant Detection Reveal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Slide the handle to uncover the hidden anomaly heatmap. Our model highlights critical structural deviations with pixel-perfect precision.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group bg-zinc-950"
        >
          {/* Top Bar */}
          <div className="h-12 bg-zinc-900/80 border-b border-zinc-800 flex items-center px-4 justify-between backdrop-blur-md sticky top-0 z-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded">
              <Layers className="w-3 h-3" />
              <span>Inspector</span>
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Interactive Area */}
          <div 
            ref={containerRef}
            className="relative h-[400px] md:h-[600px] w-full cursor-col-resize select-none overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={(e) => {
              if (e.buttons === 1) handleDrag(e);
            }}
          >
            {/* Base Image (Underneath) */}
            <div className="absolute inset-0">
              <img src={baseImage} alt="Base Satellite View" className="w-full h-full object-cover grayscale opacity-60 pointer-events-none select-none" />
              {/* Heatmap Simulation Overlay */}
              <div className="absolute inset-0 mix-blend-screen" style={{
                background: 'radial-gradient(circle at 65% 45%, rgba(244, 63, 94, 0.8) 0%, rgba(225, 29, 72, 0.5) 15%, rgba(251, 146, 60, 0.2) 35%, transparent 60%)'
              }}></div>
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
              
              <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono text-rose-400 font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                ANOMALY MASK
              </div>
            </div>

            {/* Top Image (Clipped) */}
            <div 
              className="absolute inset-0 border-r-2 border-emerald-500 bg-zinc-900/5"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img src={baseImage} alt="Original Satellite View" className="w-full h-full object-cover pointer-events-none select-none" />
              <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 font-bold flex items-center gap-2">
                ORIGINAL IMAGERY
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize flex items-center justify-center pointer-events-none drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-8 h-12 bg-zinc-900 border-2 border-emerald-500 rounded-lg shadow-xl flex items-center justify-center gap-1 backdrop-blur-md">
                <div className="w-0.5 h-4 bg-zinc-600 rounded-full" />
                <div className="w-0.5 h-4 bg-zinc-600 rounded-full" />
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
