import React, { useState, useRef, useEffect } from 'react';
import { Upload, Activity, AlertTriangle, CheckCircle, Image as ImageIcon, Layers, Map, Download, Settings, RefreshCw, ChevronRight, Terminal, Crosshair, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ score: number; isAnomaly: boolean; ssim: number; psnr: number } | null>(null);
  const [threshold, setThreshold] = useState(0.015);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResults(null);
        setLogs([]);
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleAnalyze = () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResults(null);
    setLogs([]);
    setProgress(0);
    
    // Simulated inference pipeline
    const pipeline = [
      { time: 0, progress: 10, log: "Initializing Residual Autoencoder (ResNet-50 backbone)..." },
      { time: 600, progress: 25, log: "Preprocessing: Resizing to 256x256, applying normalization..." },
      { time: 1200, progress: 45, log: "Forward pass: Encoding spatial features to latent space (16x16x512)..." },
      { time: 1800, progress: 65, log: "Forward pass: Decoding latent representation..." },
      { time: 2400, progress: 85, log: "Computing pixel-wise MSE and Structural Similarity (SSIM)..." },
      { time: 3000, progress: 95, log: "Applying Gaussian smoothing to error heatmap..." },
      { time: 3500, progress: 100, log: "Thresholding and final classification complete." }
    ];

    pipeline.forEach(step => {
      setTimeout(() => {
        addLog(step.log);
        setProgress(step.progress);
      }, step.time);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      const mockScore = Math.random() * 0.03; 
      setResults({
        score: mockScore,
        isAnomaly: mockScore > threshold,
        ssim: 0.98 - (mockScore * 5), // Mock SSIM inversely proportional to error
        psnr: 35 - (mockScore * 200)  // Mock PSNR
      });
    }, 3800);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
    setLogs([]);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans flex flex-col selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-[#0a0a0a]/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 p-2.5 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Crosshair className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-semibold tracking-tight text-lg text-zinc-100">Satellite Anomaly Detection <span className="text-emerald-500 font-mono text-xs ml-2 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">PRO</span></h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">Residual Autoencoder // High-Fidelity Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            GPU Cluster Online
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto w-full">
        
        {/* Left Sidebar - Controls & Logs */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xs font-bold text-zinc-400 flex items-center gap-2 mb-5 uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Detection Parameters
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-zinc-400 font-medium">MSE Threshold</span>
                  <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{threshold.toFixed(4)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.001" 
                  max="0.050" 
                  step="0.001" 
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                  <span>Strict (0.001)</span>
                  <span>Lenient (0.050)</span>
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-800/80">
                <h3 className="text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Model Architecture
                </h3>
                <div className="space-y-3 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <span>Backbone</span> <span className="text-zinc-200">ResNet-50 (Modified)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <span>Input Res</span> <span className="text-zinc-200">256x256x3</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <span>Loss</span> <span className="text-zinc-200">0.8*MSE + 0.2*SSIM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-0 shadow-xl flex-1 flex flex-col min-h-[250px] overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/30 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inference Logs</h2>
            </div>
            <div className="p-5 font-mono text-[11px] leading-relaxed text-zinc-500 flex-1 overflow-y-auto bg-black/40">
              {logs.length === 0 ? (
                <span className="text-zinc-700 italic">Awaiting image input...</span>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={i === logs.length - 1 && !results ? "text-emerald-400 animate-pulse" : "text-zinc-300"}
                    >
                      {log}
                    </motion.div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
            {/* Progress Bar */}
            <div className="h-1 w-full bg-zinc-900">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Upload & Action Area */}
          <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden shadow-xl">
            {!image ? (
              <div 
                className="w-full max-w-2xl border-2 border-dashed border-zinc-700/50 hover:border-emerald-500/50 bg-zinc-900/20 hover:bg-emerald-500/5 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-zinc-900 p-5 rounded-2xl mb-5 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-300 shadow-lg">
                  <Upload className="w-10 h-10 text-zinc-400 group-hover:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-3">Initialize Terrain Scan</h3>
                <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                  Upload high-resolution satellite imagery for deep learning analysis. Supported formats: JPG, PNG, WEBP, TIF.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp, image/tiff" 
                />
              </div>
            ) : (
              <div className="w-full flex flex-col md:flex-row gap-10 items-center justify-center p-4">
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 shadow-2xl max-w-md w-full group">
                  <img src={image} alt="Uploaded satellite" className="w-full h-auto object-cover aspect-square" />
                  
                  {/* Advanced Scanning Animation */}
                  {isAnalyzing && (
                    <>
                      <div className="absolute inset-0 bg-emerald-950/30 mix-blend-overlay"></div>
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                      {/* Scanner line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_20px_#34d399] z-10"
                      />
                      {/* Scanner glow */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 z-0 -mt-16"
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-4 min-w-[280px]">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || results !== null}
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing Tensor...
                      </>
                    ) : results ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Analysis Complete
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Execute Inference
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={reset}
                    disabled={isAnalyzing}
                    className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-50 text-zinc-300 rounded-xl font-medium transition-all duration-300"
                  >
                    Load New Dataset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <AnimatePresence>
            {results && image && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-zinc-800/80 gap-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-100">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      Diagnostic Report
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Detailed breakdown of reconstruction metrics</p>
                  </div>
                  
                  <div className={`px-5 py-3 rounded-xl border flex items-center gap-4 shadow-lg ${
                    results.isAnomaly 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10' 
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                  }`}>
                    {results.isAnomaly ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-0.5">Classification</div>
                      <div className="font-black text-xl leading-none tracking-tight">
                        {results.isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL TERRAIN'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Original */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
                      <span>Input Tensor</span>
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-square shadow-inner">
                      <img src={image} alt="Original" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Reconstructed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
                      <span>Reconstructed</span>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-square relative shadow-inner">
                      {/* Advanced simulated reconstruction: slight blur, color shift, lower contrast */}
                      <img src={image} alt="Reconstructed" className="w-full h-full object-cover blur-[1.5px] contrast-[0.85] brightness-95 saturate-[0.9]" />
                      <div className="absolute inset-0 bg-zinc-900/10 mix-blend-overlay"></div>
                    </div>
                  </div>

                  {/* Heatmap Overlay */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
                      <span>Error Heatmap</span>
                      <Map className="w-4 h-4" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-square relative bg-zinc-950 shadow-inner">
                      <img src={image} alt="Base" className="w-full h-full object-cover opacity-40 grayscale contrast-125" />
                      
                      {/* Advanced simulated heatmap */}
                      {results.isAnomaly ? (
                        <>
                          {/* Primary anomaly cluster */}
                          <div className="absolute inset-0 mix-blend-screen" style={{
                            background: 'radial-gradient(circle at 65% 35%, rgba(244, 63, 94, 0.9) 0%, rgba(225, 29, 72, 0.6) 20%, rgba(251, 146, 60, 0.3) 40%, transparent 60%)'
                          }}></div>
                          {/* Secondary smaller anomaly */}
                          <div className="absolute inset-0 mix-blend-screen" style={{
                            background: 'radial-gradient(circle at 30% 70%, rgba(244, 63, 94, 0.7) 0%, rgba(251, 146, 60, 0.2) 25%, transparent 45%)'
                          }}></div>
                          {/* Topographical contour lines simulation */}
                          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
                        </>
                      ) : (
                        <div className="absolute inset-0 mix-blend-screen" style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 80%)'
                        }}></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Advanced Metrics Panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/80">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest">MSE Score</div>
                    <div className="font-mono text-2xl text-zinc-100">{results.score.toFixed(5)}</div>
                    <div className="text-xs text-zinc-500 mt-1">Mean Squared Error</div>
                  </div>
                  
                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/80">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest">SSIM Index</div>
                    <div className="font-mono text-2xl text-zinc-100">{results.ssim.toFixed(4)}</div>
                    <div className="text-xs text-zinc-500 mt-1">Structural Similarity</div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/80">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest">PSNR</div>
                    <div className="font-mono text-2xl text-zinc-100">{results.psnr.toFixed(2)} <span className="text-sm text-zinc-500">dB</span></div>
                    <div className="text-xs text-zinc-500 mt-1">Peak Signal-to-Noise</div>
                  </div>

                  <div className={`rounded-xl p-4 border ${results.isAnomaly ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest">Delta (MSE - Threshold)</div>
                    <div className={`font-mono text-2xl ${results.isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {results.isAnomaly ? '+' : ''}{(results.score - threshold).toFixed(5)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">Confidence Margin</div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

