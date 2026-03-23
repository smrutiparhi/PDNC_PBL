import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-zinc-800/80 shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 p-2 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all">
            <Crosshair className="w-5 h-5 text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-lg text-zinc-100 hidden sm:block">
              Satellite Anomaly
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="#demo" className="hover:text-emerald-400 transition-colors">Demo</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            Go to App
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a] border-b border-zinc-800/80 shadow-2xl p-6 flex flex-col gap-6">
          <a href="#demo" className="text-zinc-300 font-medium hover:text-emerald-400" onClick={() => setIsMobileMenuOpen(false)}>Demo</a>
          <a href="#features" className="text-zinc-300 font-medium hover:text-emerald-400" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-zinc-300 font-medium hover:text-emerald-400" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
          <a href="#pricing" className="text-zinc-300 font-medium hover:text-emerald-400" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
          <hr className="border-zinc-800" />
          <div className="flex flex-col gap-4 pt-2">
            <Link to="/login" className="text-center font-medium text-zinc-300 hover:text-emerald-400 py-2">Sign In</Link>
            <Link to="/dashboard" className="text-center font-medium bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-lg shadow-lg">Go to App</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
