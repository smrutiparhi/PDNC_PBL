import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, X, Play, RefreshCw, Settings, Database, History } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import ImageDropzone from '../components/dashboard/ImageDropzone';
import TerminalLogs from '../components/dashboard/TerminalLogs';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import HeatmapViewer from '../components/dashboard/HeatmapViewer';
import { cn } from '../utils/cn';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('scan');
  const [image, setImage] = useState<string | null>(null);
  
  // Pipeline State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<{ score: number; isAnomaly: boolean; ssim: number; psnr: number } | null>(null);
  const [threshold, setThreshold] = useState(0.015);
  
  // Toaster State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResults(null);
      setLogs([]);
      setProgress(0);
      addToast("Image loaded into tensor memory successfully.", "success");
    };
    reader.readAsDataURL(file);
  };

  const executeInference = () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResults(null);
    setLogs([]);
    setProgress(0);
    
    // Simulate complex pipeline
    const pipeline = [
      { time: 0, progress: 10, log: "Initializing Residual Autoencoder (ResNet-50 backbone)..." },
      { time: 600, progress: 25, log: "Preprocessing: Resizing to 256x256, applying normalization..." },
      { time: 1200, progress: 45, log: "Forward pass: Encoding spatial features to latent space (16x16x512)..." },
      { time: 1800, progress: 65, log: "Forward pass: Decoding latent representation..." },
      { time: 2400, progress: 85, log: "Computing pixel-wise MSE and Structural Similarity (SSIM)..." },
      { time: 3000, progress: 95, log: "Applying Gaussian smoothing to error heatmap..." },
      { time: 3500, progress: 100, log: "Thresholding and final classification complete." }
    ];

    addToast("Inference pipeline started.", "info");

    pipeline.forEach(step => {
      setTimeout(() => {
        setLogs(prev => [...prev, step.log]);
        setProgress(step.progress);
      }, step.time);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      const mockScore = Math.random() * 0.03; 
      const isAnomaly = mockScore > threshold;
      setResults({
        score: mockScore,
        isAnomaly,
        ssim: 0.98 - (mockScore * 5),
        psnr: 35 - (mockScore * 200)
      });
      addToast(isAnomaly ? "CRITICAL: Anomaly detected in scan!" : "Scan complete. No anomalies detected.", isAnomaly ? "error" : "success");
    }, 4000);
  };

  const resetTarget = () => {
    setImage(null);
    setResults(null);
    setLogs([]);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-50 font-sans flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto relative">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50 -translate-y-1/2 translate-x-1/3" />
        
        {/* Workspace Content */}
        <div className="max-w-7xl mx-auto relative z-10 font-sans">
          
          <header className="mb-8 flex justify-between items-end border-b border-zinc-800/80 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">
                {activeTab === 'scan' ? "Live Analysis Sandbox" : 
                 activeTab === 'history' ? "Scan History Archives" : 
                 activeTab === 'models' ? "Model Registry" : 
                 "System Configuration"}
              </h1>
              <p className="text-sm font-medium text-zinc-400">
                {activeTab === 'scan' ? "Deploy high-resolution scans into the isolated inference engine." :
                 activeTab === 'history' ? "Review and export historical analysis reports." :
                 activeTab === 'models' ? "Manage, tune, and deploy custom anomaly detection weights." :
                 "Manage user settings, compute quotas, and access control lists."}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest font-bold text-zinc-500">
              <span className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", activeTab === 'scan' || activeTab === 'history' ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} /> 
                {activeTab === 'scan' || activeTab === 'history' ? "Cluster Active" : "Standing By"}
              </span>
            </div>
          </header>

          {activeTab === 'scan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Left Column (Controls & Logs) */}
            <div className="lg:col-span-4 flex flex-col gap-8 h-full">
              
              {/* Parameters Panel */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xs font-bold text-zinc-300 flex items-center gap-2 mb-6 uppercase tracking-widest font-mono">
                  <Settings className="w-4 h-4 text-emerald-500" /> Model Parameters
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-3">
                      <span className="text-zinc-400 font-medium">Detection Tolerance</span>
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{threshold.toFixed(4)}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.001" max="0.050" step="0.001" 
                      value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono tracking-widest uppercase font-bold">
                      <span>Strict</span><span>Lenient</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800/80">
                    <h3 className="text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2 font-mono">
                      <Database className="w-4 h-4" /> Architecture
                    </h3>
                    <div className="space-y-2 text-xs font-mono text-zinc-500">
                      <div className="flex justify-between items-center bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                        <span>Backbone</span> <span className="text-zinc-300 font-bold">ResNet-50</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                        <span>Input Res</span> <span className="text-zinc-300 font-bold">256x256x3</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                        <span>Weights</span> <span className="text-emerald-400 bg-emerald-400/10 px-1 rounded">v2.4.1-prod</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Terminal */}
              <div className="flex-1 min-h-[300px]">
                <TerminalLogs logs={logs} progress={progress} isAnalyzing={isAnalyzing} hasResults={results !== null} />
              </div>
            </div>

            {/* Right Column (Viewer & Metrics) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {!image ? (
                <div className="h-[500px]">
                  <ImageDropzone onImageSelect={handleImageSelect} />
                </div>
              ) : (
                <>
                  {!results && !isAnalyzing ? (
                    <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center gap-8 h-[500px]">
                      <div className="flex-1 w-full h-full p-4">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 relative group">
                          <img src={image} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">Ready for inference</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-64 flex flex-col gap-4 pr-8 pb-8 md:pb-0">
                        <button 
                          onClick={executeInference}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group active:scale-95"
                        >
                          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Run Scanner
                        </button>
                        <button 
                          onClick={resetTarget}
                          className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          Reject Target
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {/* Advanced Top Viewer Block */}
                      <div className="relative">
                        <HeatmapViewer image={image} isAnomaly={results?.isAnomaly ?? false} />
                        
                        {/* Dynamic Scan Overlay */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-emerald-500">
                            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                            <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-emerald-400">Processing Tensor Data...</h3>
                          </div>
                        )}
                      </div>

                      {/* Animated Metrics */}
                      {results && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative"
                        >
                          <MetricsPanel 
                            score={results.score} 
                            ssim={results.ssim} 
                            psnr={results.psnr} 
                            threshold={threshold}
                            isAnomaly={results.isAnomaly}
                          />
                          
                          <div className="mt-8 flex justify-end gap-4">
                            <button 
                              onClick={executeInference}
                              className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Re-Run Layer
                            </button>
                            <button 
                              onClick={resetTarget}
                              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                              Load New Scan
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

          {activeTab === 'history' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center h-[500px] border border-zinc-800/50 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm shadow-xl mt-4">
                <History className="w-16 h-16 text-zinc-800 mb-6" />
                <h2 className="text-2xl font-bold text-zinc-100 mb-2">Scan History Empty</h2>
                <p className="text-zinc-500 max-w-sm mb-6">Your previous anomaly scan logs, segmented arrays, and detection reports will be archived here.</p>
                <button onClick={() => setActiveTab('scan')} className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 font-bold rounded-xl transition-all shadow-lg active:scale-95">Start a new scan</button>
             </motion.div>
          )}

          {activeTab === 'models' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center h-[500px] border border-zinc-800/50 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm shadow-xl mt-4">
                <Database className="w-16 h-16 text-zinc-800 mb-6" />
                <h2 className="text-2xl font-bold text-zinc-100 mb-2">AI Models Registry</h2>
                <p className="text-zinc-500 max-w-sm mb-6 leading-relaxed">You currently have access to the ResNet-50 v2.4.1-prod weights. Connect your AWS S3 bucket to import custom checkpoints.</p>
                <button className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl transition-all hover:bg-emerald-500/20 shadow-lg active:scale-95">Connect S3 Bucket</button>
             </motion.div>
          )}

          {activeTab === 'settings' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center h-[500px] border border-zinc-800/50 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm shadow-xl mt-4">
                <Settings className="w-16 h-16 text-zinc-800 mb-6" />
                <h2 className="text-2xl font-bold text-zinc-100 mb-2">System Configuration</h2>
                <p className="text-zinc-500 max-w-sm mb-6">Warning: Modifying cluster compute quotas or inference thresholds requires Level 2 clearance.</p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 font-bold rounded-xl transition-all shadow-lg active:scale-95">Billing Overview</button>
                  <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-bold rounded-xl transition-all shadow-lg active:scale-95">Access Control</button>
                </div>
             </motion.div>
          )}

        </div>
      </main>

      {/* Global Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[320px]">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={cn(
                "p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 relative overflow-hidden",
                toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                toast.type === 'error' ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                "bg-zinc-900 border-zinc-800 text-zinc-300"
              )}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <RefreshCw className="w-5 h-5 shrink-0 animate-spin" />}
              <span className="text-sm font-medium leading-tight pt-0.5">{toast.message}</span>
              <button 
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
