import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Eye, Database, Shield, LayoutDashboard, Activity, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

const features = [
  {
    title: "ResNet-50 Deep Architecture",
    description: "Built on a modified, pre-trained ResNet-50 architecture engineered for perfect multi-spectral spatial feature extraction.",
    icon: <Cpu className="w-6 h-6 text-emerald-400" />,
    className: "md:col-span-2 bg-gradient-to-br from-[#090b0a] via-[#05110d] to-[#030605] border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_40px_rgba(16,185,129,0.05)]",
    glow: "bg-emerald-500/20",
    visual: (
      <div className="absolute right-[-10%] bottom-[-10%] w-[120%] h-[60%] opacity-30 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,transparent_1px,rgba(16,185,129,0.2)_1px),linear-gradient(transparent_1px,rgba(16,185,129,0.2)_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>
    )
  },
  {
    title: "Real-time Processing",
    description: "Optimized tensor operations achieve inference speeds under 50ms per megapixel on GPU.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    className: "md:col-span-1 border-zinc-800 bg-gradient-to-tr from-zinc-950 to-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
    glow: "bg-yellow-500/10",
    visual: (
      <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full border border-yellow-500/20 bg-yellow-500/5 animate-[pulse_3s_infinite]">
         <span className="text-yellow-500 text-[10px] font-mono font-bold">50ms</span>
      </div>
    )
  },
  {
    title: "High-Fidelity Analysis",
    description: "Detects sub-pixel anomalies calculating local MSE alongside SSIM index mapping.",
    icon: <Eye className="w-6 h-6 text-sky-400" />,
    className: "md:col-span-1 border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
    glow: "bg-sky-500/10",
    visual: null
  },
  {
    title: "Scalable Data Pipeline",
    description: "Ingest gigabytes of raw TIFF data effortlessly. Integration ready for AWS S3 and GCS.",
    icon: <Database className="w-6 h-6 text-purple-400" />,
    className: "md:col-span-1 border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
    glow: "bg-purple-500/10",
    visual: null
  },
  {
    title: "Military Grade Isolation",
    description: "End-to-end encryption for sensitive military or commercial satellite feeds. Fully air-gap compatible.",
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    className: "md:col-span-2 lg:col-span-1 border-rose-900/30 bg-gradient-to-br from-rose-950/20 to-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden",
    glow: "bg-rose-500/10",
    visual: (
      <div className="absolute -bottom-8 -right-8 opacity-20 rotate-12 pointer-events-none">
        <Lock className="w-32 h-32 text-rose-500" />
      </div>
    )
  },
  {
    title: "Intuitive Web Dashboard",
    description: "Detailed analytics, historical tracking, and robust model management accessible via our premium fast web interface.",
    icon: <LayoutDashboard className="w-6 h-6 text-teal-400" />,
    className: "md:col-span-3 lg:col-span-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6",
    glow: "bg-teal-500/10",
    visual: (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-[120%] bg-gradient-to-l from-teal-500/5 to-transparent blur-2xl pointer-events-none" />
    )
  }
];

export default function FeaturesBento() {
  return (
    <section id="features" className="py-32 bg-[#050505] relative z-10 overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-1.5 mb-8 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md text-zinc-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="opacity-80">Architecture & Infrastructure</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-widest uppercase mb-4"
          >
            Engineered For <span className="text-emerald-400">Precision</span>.
            <br />
            Built For <span className="text-teal-500">Scale</span>.
          </motion.h2>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-zinc-500 text-lg max-w-2xl font-light leading-relaxed"
          >
             The definitive platform for processing massive geospatial datasets leveraging optimized tensor networks and state-of-the-art anomaly isolation filters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={cn(
                "group relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl transition-all duration-500 border",
                feature.className
              )}
            >
              {/* Internal Dynamic Glow */}
              <div className={cn(
                "absolute -inset-px opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 rounded-3xl -z-10",
                feature.glow
              )} />
              
              {/* Optional Visual Injection */}
              {feature.visual}
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-black/80 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 mb-4">
                  {feature.icon}
                </div>
                <div className="mt-auto relative z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-100 mb-3 tracking-tight drop-shadow-md">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400/90 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
