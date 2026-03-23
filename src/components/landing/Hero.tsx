import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Crosshair, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 opacity-50 mix-blend-screen" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        {/* Floating Particles Simulation */}
        <motion.div
           animate={{
            transform: ['translateY(0px)', 'translateY(-20px)', 'translateY(0px)'],
           }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
        />
        <motion.div
           animate={{
            transform: ['translateY(0px)', 'translateY(30px)', 'translateY(0px)'],
           }}
           transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute top-[60%] left-[10%] w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
        />
        <motion.div
           animate={{
            transform: ['translateX(0px)', 'translateX(25px)', 'translateX(0px)'],
           }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute bottom-[20%] right-[30%] w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_15px_#6ee7b7] opacity-60"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono backdrop-blur-md uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ResNet-50 Engine Online
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 tracking-tight leading-none mb-8 drop-shadow-sm">
            Detect Earth's Anomalies
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              In Real-Time
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Harness the power of residual autoencoders to process high-resolution satellite imagery. Identify surface changes, detect infrastructure anomalies, and monitor environmental shifts with unparalleled fidelity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Crosshair className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Launch Dashboard</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="#demo"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-zinc-300 font-medium rounded-2xl hover:bg-zinc-800 hover:text-white transition-all duration-300"
          >
            Watch Demo
            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
