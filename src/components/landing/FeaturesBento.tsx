import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Eye, Database, Shield, LayoutDashboard } from 'lucide-react';
import { cn } from '../../utils/cn';

const features = [
  {
    title: "ResNet-50 Backbone",
    description: "Built on a modified, pre-trained ResNet-50 architecture engineered for multi-spectral spatial feature extraction.",
    icon: <Cpu className="w-6 h-6 text-emerald-400" />,
    className: "md:col-span-2 lg:row-span-2 bg-gradient-to-br from-zinc-900 via-[#0a0f0d] to-zinc-950 border border-emerald-500/20",
    glow: "bg-emerald-500/10"
  },
  {
    title: "Real-time Processing",
    description: "Optimized tensor operations achieve inference speeds under 50ms per megapixel on modern GPU clusters.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    className: "md:col-span-1 border border-zinc-800",
    glow: "bg-yellow-500/10"
  },
  {
    title: "High-Fidelity Analysis",
    description: "Detects sub-pixel anomalies by calculating local MSE alongside Structural Similarity Index Measure (SSIM).",
    icon: <Eye className="w-6 h-6 text-blue-400" />,
    className: "md:col-span-1 border border-zinc-800",
    glow: "bg-blue-500/10"
  },
  {
    title: "Scalable Data Pipeline",
    description: "Ingest gigabytes of raw TIFF data effortlessly. Integration ready for AWS S3 and Google Cloud Storage.",
    icon: <Database className="w-6 h-6 text-purple-400" />,
    className: "md:col-span-1 border border-zinc-800",
    glow: "bg-purple-500/10"
  },
  {
    title: "Enterprise Grade Security",
    description: "End-to-end encryption for sensitive military or commercial satellite feeds. Fully air-gap compatible.",
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    className: "md:col-span-2 lg:col-span-1 border border-zinc-800",
    glow: "bg-rose-500/10"
  },
  {
    title: "Intuitive Dashboard",
    description: "Detailed analytics, historical tracking, and robust model management accessible via our premium web interface.",
    icon: <LayoutDashboard className="w-6 h-6 text-sky-400" />,
    className: "md:col-span-3 lg:col-span-2 bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center gap-6 border border-zinc-700",
    glow: "bg-sky-500/10"
  }
];

export default function FeaturesBento() {
  return (
    <section id="features" className="py-32 bg-[#050505] relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono tracking-widest uppercase"
          >
            <Shield className="w-3 h-3 text-emerald-500" />
            Core Architecture
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight"
          >
            Engineered for precision.
            <br />
            <span className="text-zinc-500">Built for scale.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[220px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={cn(
                "group relative rounded-3xl p-8 overflow-hidden backdrop-blur-sm transition-all duration-300",
                "bg-zinc-900/50 hover:bg-zinc-900 hover:shadow-2xl hover:border-zinc-700",
                feature.className
              )}
            >
              {/* Dynamic Glow Background */}
              <div className={cn(
                "absolute -inset-px opacity-0 group-hover:opacity-100 blur-[50px] transition-opacity duration-500 rounded-3xl -z-10",
                feature.glow
              )} />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="bg-black/50 w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
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
