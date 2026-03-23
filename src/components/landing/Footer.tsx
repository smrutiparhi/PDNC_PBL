import React from 'react';
import { Crosshair, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#020202] pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 p-2 rounded-xl border border-emerald-500/30">
                <Crosshair className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-semibold tracking-tight text-lg text-zinc-100">
                Satellite Anomaly
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mt-2">
              Advanced deep learning for satellite imagery. We build resilient AI models to monitor infrastructure and the environment with unprecedented accuracy.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors border border-zinc-800">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors border border-zinc-800">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors border border-zinc-800">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-zinc-100">Product</h3>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#demo" className="hover:text-emerald-400 transition-colors">Interactive Demo</a>
              <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing Options</a>
              <Link to="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                Launch App <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Pro</span>
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-zinc-100">Resources</h3>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Research Papers</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">System Status</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-zinc-100">Stay Updated</h3>
            <p className="text-sm text-zinc-400 mb-2">Subscribe to our newsletter for the latest model updates and research.</p>
            <form className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-24 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <button
                type="button"
                className="absolute right-1 top-1 bottom-1 px-4 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-mono">
            &copy; {new Date().getFullYear()} Satellite Anomaly Detection. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-zinc-500 font-mono">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
