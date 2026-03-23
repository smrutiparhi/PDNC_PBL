import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Layers, Image as ImageIcon, Map, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

interface HeatmapViewerProps {
  image: string;
  isAnomaly: boolean;
  reconstructedImage?: string | null;
  heatmapImage?: string | null;
}

export default function HeatmapViewer({ image, isAnomaly, reconstructedImage, heatmapImage }: HeatmapViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      
      {/* Viewer Toolbar */}
      <div className="h-14 bg-zinc-900/50 border-b border-zinc-800/80 flex items-center justify-between px-4 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-zinc-100 font-mono tracking-widest uppercase">Multi-Spectral Array View</h2>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800 shadow-inner">
          <button onClick={handleZoomOut} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-500 w-12 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={handleZoomIn} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button onClick={handleResetZoom} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Reset">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 3 synchronized panels */}
      <div 
        className={cn(
          "flex-1 p-4 grid grid-cols-3 gap-4 bg-zinc-950/50 relative overflow-hidden",
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] pointer-events-none" />

         {/* 1. Original Image */}
         <div className="bg-[#050505] relative border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group pointer-events-none">
           <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-start px-4 pt-3">
             <div className="flex items-center gap-2">
               <ImageIcon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
               <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest drop-shadow-md">Original Input</span>
             </div>
           </div>
           
           <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
             <div className="w-full flex items-center justify-center" style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
               <div className="relative aspect-square w-full max-h-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 pointer-events-auto">
                 <img src={image} alt="Base" className="w-full h-full object-cover block" draggable={false} />
               </div>
             </div>
           </div>
         </div>

         {/* 2. Reconstructed Image */}
         <div className="bg-[#050505] relative border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group pointer-events-none">
           <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-start px-4 pt-3 justify-between">
             <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
               <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest drop-shadow-md">Reconstructed</span>
             </div>
           </div>
           
           <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
             <div className="w-full flex items-center justify-center" style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
               <div className="relative aspect-square w-full max-h-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 pointer-events-auto">
                  <img src={reconstructedImage || image} alt="Reconstructed" className={cn("w-full h-full object-cover", !reconstructedImage && "blur-[2px] contrast-[0.9] saturate-[0.8]")} draggable={false} />
                  {!reconstructedImage && <div className="absolute inset-0 bg-zinc-900/10 mix-blend-overlay"></div>}
               </div>
             </div>
           </div>
         </div>

         {/* 3. Heatmap Image */}
         <div className="bg-[#050505] relative border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group pointer-events-none">
           <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-start px-4 pt-3 justify-between">
             <div className="flex items-center gap-2">
               <Map className={cn("w-4 h-4 transition-colors", isAnomaly ? "text-rose-500 group-hover:text-rose-400" : "text-emerald-500")} />
               <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest drop-shadow-md", isAnomaly ? "text-rose-500" : "text-emerald-500")}>Error Heatmap</span>
             </div>
           </div>
           
           <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
             <div className="w-full flex items-center justify-center" style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
               <div className="relative aspect-square w-full max-h-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 pointer-events-auto">
                 {heatmapImage ? (
                    <img src={heatmapImage} alt="Heatmap" className="w-full h-full object-cover" draggable={false} />
                 ) : (
                    <>
                      <img src={image} alt="Mask" className="w-full h-full object-cover opacity-80 grayscale contrast-150 mix-blend-multiply" draggable={false} />
                      {isAnomaly ? (
                         <>
                           <div className="absolute inset-0" style={{
                             background: 'radial-gradient(circle at 60% 40%, rgba(244, 63, 94, 0.9) 0%, rgba(225, 29, 72, 0.6) 20%, rgba(251, 146, 60, 0.3) 40%, transparent 60%)'
                           }}></div>
                           <div className="absolute inset-0 mix-blend-screen" style={{
                             background: 'radial-gradient(circle at 35% 75%, rgba(244, 63, 94, 0.7) 0%, rgba(251, 146, 60, 0.2) 25%, transparent 45%)'
                           }}></div>
                         </>
                      ) : (
                         <div className="absolute inset-0" style={{
                           background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 80%)'
                         }}></div>
                      )}
                    </>
                 )}
               </div>
             </div>
           </div>
         </div>

      </div>
    </div>
  );
}
