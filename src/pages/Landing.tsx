import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import DemoShowcase from '../components/landing/DemoShowcase';
import FeaturesBento from '../components/landing/FeaturesBento';
import HowItWorks from '../components/landing/HowItWorks';
import PricingCards from '../components/landing/PricingCards';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-emerald-500/30">
      <Navbar />
      <Hero />
      <DemoShowcase />
      <FeaturesBento />
      <HowItWorks />
      <PricingCards />
      <Footer />
    </div>
  );
}
