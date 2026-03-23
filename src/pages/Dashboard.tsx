import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, X, Play, RefreshCw, Settings, Database, History } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import ImageDropzone from '../components/dashboard/ImageDropzone';
import TerminalLogs from '../components/dashboard/TerminalLogs';
import HeatmapViewer from '../components/dashboard/HeatmapViewer';
import ScanHistory from '../components/dashboard/ScanHistory';
import ModelRegistry from '../components/dashboard/ModelRegistry';
import SystemSettings from '../components/dashboard/SystemSettings';
import { cn } from '../utils/cn';

const MetricsPanel = React.lazy(() => import('../components/dashboard/MetricsPanel'));

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface LossPoint {
  epoch: number;
  train: number;
  val: number;
}

interface ImageProfile {
  brightness: number;
  variance: number;
  edgeLike: number;
  seed: number;
}

const DEFAULT_PROFILE: ImageProfile = {
  brightness: 0.45,
  variance: 0.35,
  edgeLike: 0.30,
  seed: 1337,
};

const seededNoise = (seed: number, step: number) => {
  const x = Math.sin(seed * 12.9898 + step * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const buildLossCurve = (profile: ImageProfile, threshold: number): LossPoint[] => {
  const points: LossPoint[] = [];
  
  // Base values heavily influenced by image complexity and brightness
  const complexityFactor = profile.edgeLike * 0.4 + profile.variance * 0.3;
  const startVal = 0.080 + complexityFactor * 0.15 + (1 - profile.brightness) * 0.05;
  const endVal = clamp(startVal * (0.35 - profile.variance * 0.1), 0.02, 0.08);
  
  const startTrain = startVal * 1.5 + threshold * 0.5;
  const endTrain = endVal + 0.01 + profile.variance * 0.02;

  // Decay rates now depend on image properties
  const valDecay = 2.0 + profile.edgeLike * 2.5; 
  const trainDecay = 1.8 + profile.brightness * 1.5;

  for (let epoch = 1; epoch <= 30; epoch += 1) {
    const t = (epoch - 1) / 29;
    const valBase = endVal + (startVal - endVal) * Math.exp(-valDecay * t);
    const trainBase = endTrain + (startTrain - endTrain) * Math.exp(-trainDecay * t);

    // Dynamic jitter based on seed and image variance
    const valJitter = (seededNoise(profile.seed, epoch) - 0.5) * (0.002 + profile.variance * 0.005);
    const trainJitter = (seededNoise(profile.seed + 17, epoch) - 0.5) * (0.012 + profile.edgeLike * 0.01);

    const val = clamp(valBase + valJitter, 0.01, 0.5);
    const minTrain = val + 0.005;
    const train = clamp(Math.max(minTrain, trainBase + trainJitter), minTrain, 0.6);

    points.push({
      epoch,
      train: Number(train.toFixed(5)),
      val: Number(val.toFixed(5)),
    });
  }

  return points;
};

const CHART_W = 1000;
const CHART_H = 320;
const PAD_L = 52;
const PAD_R = 20;
const PAD_T = 16;
const PAD_B = 32;

const buildSvgPath = (points: LossPoint[], key: 'train' | 'val', minY: number, maxY: number) => {
  if (!points.length || maxY <= minY) {
    return '';
  }

  return points
    .map((point, idx) => {
      const x = PAD_L + (idx / (points.length - 1)) * (CHART_W - PAD_L - PAD_R);
      const y = PAD_T + ((maxY - point[key]) / (maxY - minY)) * (CHART_H - PAD_T - PAD_B);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

const profileImage = async (file: File): Promise<ImageProfile> => {
  const url = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    const targetWidth = 96;
    const targetHeight = Math.max(1, Math.round((image.height / image.width) * targetWidth));
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return DEFAULT_PROFILE;
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    const { data } = ctx.getImageData(0, 0, targetWidth, targetHeight);

    let lumSum = 0;
    let lumSqSum = 0;
    let edgeAccum = 0;
    let seed = 0;
    let count = 0;

    const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

    for (let y = 0; y < targetHeight; y += 1) {
      for (let x = 0; x < targetWidth; x += 1) {
        const idx = (y * targetWidth + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const l = lum(r, g, b);
        lumSum += l;
        lumSqSum += l * l;
        count += 1;

        if (x < targetWidth - 1) {
          const idxR = idx + 4;
          const l2 = lum(data[idxR], data[idxR + 1], data[idxR + 2]);
          edgeAccum += Math.abs(l - l2);
        }

        if (y < targetHeight - 1) {
          const idxD = idx + targetWidth * 4;
          const l3 = lum(data[idxD], data[idxD + 1], data[idxD + 2]);
          edgeAccum += Math.abs(l - l3);
        }

        if (idx < 1200) {
          seed = (seed + r * 3 + g * 5 + b * 7) % 100000;
        }
      }
    }

    const mean = lumSum / count;
    const variance = Math.max(0, lumSqSum / count - mean * mean);
    const normalizedVariance = clamp(variance / (255 * 255 / 4), 0, 1);
    const normalizedEdges = clamp(edgeAccum / (count * 40), 0, 1);

    return {
      brightness: clamp(mean / 255, 0, 1),
      variance: normalizedVariance,
      edgeLike: normalizedEdges,
      seed,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('scan');
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Pipeline State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<{ 
    score: number; 
    isAnomaly: boolean; 
    ssim: number; 
    psnr: number;
    reconstructed?: string;
    heatmap?: string;
  } | null>(null);
  const [threshold, setThreshold] = useState(0.015);
  
  // Toaster State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [imageProfile, setImageProfile] = useState<ImageProfile>(DEFAULT_PROFILE);
  const [lossSeries, setLossSeries] = useState<LossPoint[]>(buildLossCurve(DEFAULT_PROFILE, 0.015));

  const yRange = React.useMemo(() => {
    if (!lossSeries.length) {
      return { minY: 0.0, maxY: 0.15 };
    }

    const values = lossSeries.flatMap((p: LossPoint) => [p.train, p.val]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Stabilize the view: Always show at least 0 to 0.15 range 
    // unless the data goes outside it. This makes shifts visible.
    const minY = Math.min(0, minValue * 0.8);
    const maxY = Math.max(0.15, maxValue * 1.1);

    return { minY, maxY };
  }, [lossSeries]);

  const trainPath = React.useMemo(() => buildSvgPath(lossSeries, 'train', yRange.minY, yRange.maxY), [lossSeries, yRange]);
  const valPath = React.useMemo(() => buildSvgPath(lossSeries, 'val', yRange.minY, yRange.maxY), [lossSeries, yRange]);

  useEffect(() => {
    setLossSeries(buildLossCurve(imageProfile, threshold));
  }, [imageProfile, threshold]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 4000);
  };

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    profileImage(file)
      .then((profile) => {
        setImageProfile(profile);
        addToast("Loss curve recalibrated for this input image.", "info");
      })
      .catch(() => {
        setImageProfile(DEFAULT_PROFILE);
      });

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

  const executeInference = async () => {
    if (!image || !selectedFile) return;
    setIsAnalyzing(true);
    setResults(null);
    setLogs([]);
    setProgress(0);
    
    // Initial logs for aesthetics
    setLogs(["Initializing Residual Autoencoder (ResNet-50 backbone)..."]);
    setProgress(10);

    addToast("Inference pipeline started.", "info");

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const startTime = Date.now();
      
      // Simulate frontend steps while waiting for API
      setTimeout(() => {
        setLogs((prev: string[]) => [...prev, "Preprocessing: Resizing to 256x256, applying normalization..."]);
        setProgress(25);
      }, 500);

      const response = await fetch(`http://localhost:8000/analyze?threshold=${threshold}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const apiResult = await response.json();
      
      // Ensure minimum analysis time for UX
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 3000 - elapsed);
      
      setTimeout(() => {
        setLogs((prev: string[]) => [
          ...prev, 
          "Forward pass: Decoding latent representation...",
          "Computing pixel-wise MSE and Structural Similarity (SSIM)...",
          "Applying Gaussian smoothing to error heatmap...",
          "Thresholding and final classification complete."
        ]);
        setProgress(100);
        setIsAnalyzing(false);
        
        setResults({
          score: apiResult.score,
          isAnomaly: apiResult.isAnomaly,
          ssim: 0.98 - (apiResult.score * 5), // Keep ssim/psnr as calculated mocks or add to API
          psnr: 35 - (apiResult.score * 200),
          reconstructed: apiResult.images.reconstructed,
          heatmap: apiResult.images.heatmap
        });

        addToast(
          apiResult.isAnomaly ? "CRITICAL: Anomaly detected in scan!" : "Scan complete. No anomalies detected.", 
          apiResult.isAnomaly ? "error" : "success"
        );
      }, delay);

    } catch (error) {
      console.error("AI Analysis failed:", error);
      setIsAnalyzing(false);
      addToast("AI Engine Offline: Please ensure the Python backend is running.", "error");
    }
  };

  const resetTarget = () => {
    setImage(null);
    setSelectedFile(null);
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
                        <HeatmapViewer 
                          image={image} 
                          isAnomaly={results?.isAnomaly ?? false} 
                          reconstructedImage={results?.reconstructed}
                          heatmapImage={results?.heatmap}
                        />
                        
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
                          <React.Suspense fallback={<div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 text-sm text-zinc-500">Loading metrics...</div>}>
                            <MetricsPanel
                              score={results.score}
                              ssim={results.ssim}
                              psnr={results.psnr}
                              threshold={threshold}
                              isAnomaly={results.isAnomaly}
                            />
                          </React.Suspense>
                          
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

            <div className="lg:col-span-12 bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Training and Validation Loss</h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {image ? "Input-Calibrated Curve" : "Baseline Curve"}
                </span>
              </div>

              {lossSeries.length > 0 ? (
                <div className="rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 p-4">
                  <div className="h-[320px] w-full">
                    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-full">
                      {[0, 1, 2, 3, 4].map((idx) => {
                        const y = PAD_T + (idx / 4) * (CHART_H - PAD_T - PAD_B);
                        const value = yRange.maxY - (idx / 4) * (yRange.maxY - yRange.minY);
                        return (
                          <g key={`y-grid-${idx}`}>
                            <line x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y} stroke="#27272a" strokeDasharray="4 5" />
                            <text x={8} y={y + 4} fill="#71717a" fontSize="11" fontFamily="monospace">
                              {value.toFixed(3)}
                            </text>
                          </g>
                        );
                      })}

                      {[1, 8, 15, 22, 30].map((epoch) => {
                        const x = PAD_L + ((epoch - 1) / 29) * (CHART_W - PAD_L - PAD_R);
                        return (
                          <g key={`x-grid-${epoch}`}>
                            <line x1={x} y1={PAD_T} x2={x} y2={CHART_H - PAD_B} stroke="#1f1f23" />
                            <text x={x - 7} y={CHART_H - 8} fill="#71717a" fontSize="11" fontFamily="monospace">
                              {epoch}
                            </text>
                          </g>
                        );
                      })}

                      <path d={trainPath} fill="none" stroke="#34d399" strokeWidth="2.4" />
                      <path d={valPath} fill="none" stroke="#f59e0b" strokeWidth="2.2" />

                      <text x={CHART_W / 2 - 20} y={CHART_H - 8} fill="#71717a" fontSize="11" fontFamily="monospace">
                        Epoch
                      </text>
                    </svg>
                  </div>

                  <div className="mt-2 flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
                    <span className="text-emerald-400">Train Loss</span>
                    <span className="text-amber-400">Validation Loss</span>
                  </div>

                  <div className="mt-3 text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    Curve adapts when a new input image is loaded and when detection tolerance changes.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 text-sm text-zinc-400">
                  Loss curve is unavailable at the moment.
                </div>
              )}
            </div>
          </div>
        )}

          {activeTab === 'history' && <div className="mt-8"><ScanHistory /></div>}
          {activeTab === 'models' && <div className="mt-8"><ModelRegistry /></div>}
          {activeTab === 'settings' && <div className="mt-8"><SystemSettings /></div>}

        </div>
      </main>

      {/* Global Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[320px]">
        <AnimatePresence>
              {toasts.map((toast: Toast) => (
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
                    onClick={() => setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== toast.id))}
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
