import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Crosshair, ChevronRight, Activity, Satellite, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* 
        ========================================
        Dynamic Animated Background Elements
        ========================================
      */}
      <div className="absolute inset-0 z-0">
        {/* Core Glow Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px] opacity-70 mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[140px] opacity-60 mix-blend-screen" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-cyan-900/40 rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none" 
        />
        
        {/* Orbital Satellite Alpha - Left to Right */}
        <motion.div
           animate={{ left: ['-30%', '120%'], top: ['20%', '0%'], rotate: [15, -10] }}
           transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           className="absolute z-0 opacity-20 pointer-events-none drop-shadow-[0_0_80px_rgba(16,185,129,0.4)]"
        >
           <Satellite className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-zinc-500/40" strokeWidth={0.5} />
        </motion.div>

        {/* Orbital Satellite Beta - Right to Left */}
        <motion.div
           animate={{ right: ['-30%', '120%'], top: ['60%', '30%'], rotate: [-20, 10] }}
           transition={{ duration: 65, repeat: Infinity, ease: "linear", delay: 10 }}
           className="absolute z-0 opacity-10 pointer-events-none drop-shadow-[0_0_50px_rgba(20,184,166,0.3)] scale-x-[-1]"
        >
           <Satellite className="w-[200px] h-[200px] md:w-[450px] md:h-[450px] text-zinc-600/30" strokeWidth={0.5} />
        </motion.div>
        
        {/* Perspective Grid with Scanning Laser */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] [transform:rotateX(60deg)_scale(2.5)] origin-bottom opacity-40" />
        
        <motion.div
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_20px_#34d399] opacity-30 z-0"
        />

        {/* Floating Abstract Tech Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[10%] hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md shadow-2xl"
        >
          <Satellite className="w-8 h-8 text-emerald-400/80" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[35%] right-[10%] hidden lg:flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900/50 border border-white/5 backdrop-blur-md shadow-2xl"
        >
          <ShieldAlert className="w-10 h-10 text-cyan-400/80" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[20%] hidden md:flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900/50 border border-white/5 backdrop-blur-md shadow-2xl"
        >
          <Activity className="w-7 h-7 text-teal-400/80" />
        </motion.div>
      </div>

      {/* 
        ========================================
        Main Hero Content
        ========================================
      */}
      <div className="container relative z-20 mx-auto px-6 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
        >
          {/* Status Pill */}
          <div className="flex items-center justify-center mb-8">
            <div className="group relative inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-zinc-900/80 backdrop-blur-xl text-emerald-300 text-xs sm:text-sm font-medium tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-500/40 hover:bg-zinc-800/80 transition-all duration-300 cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </span>
              Autoencoder Pipeline Live
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 
            style={{ fontFamily: "'Bruno Ace SC', sans-serif" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 tracking-[0.1em] md:tracking-[0.2em] uppercase leading-tight mb-8 pb-2 drop-shadow-2xl"
          >
            SATELLITE
            <br />
            ANOMALY
            <br />
            <span className="relative inline-block mt-4 md:mt-6">
              <span className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full opacity-50" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 tracking-[0.15em] md:tracking-[0.3em] ml-2">
                DETECTION
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-4 text-lg md:text-xl lg:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
            Harness unsupervised deep learning to process high-resolution satellite imagery. Pinpoint deforestation, illegal infrastructure, and ecological shifts instantly.
          </p>
        </motion.div>

        {/* Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Primary CTA */}
          <Link
            to="/dashboard"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] border border-emerald-300/30"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <Crosshair className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Launch Dashboard</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {/* Secondary CTA */}
          <a
            href="#demo"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-zinc-800/80 border border-zinc-500/50 backdrop-blur-xl text-zinc-100 font-bold text-lg rounded-2xl hover:bg-zinc-700 hover:text-white hover:border-zinc-400 transition-all duration-300 shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Watch Demo</span>
            <ChevronRight className="w-5 h-5 relative z-10 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      </div>
      
      {/* 
        ========================================
        Bottom Fade Alpha Matte
        ========================================
      */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
