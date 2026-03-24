import React from 'react';
import { Suspense, lazy } from 'react';
const Navbar = lazy(() => import('../components/landing/Navbar'));
const Hero = lazy(() => import('../components/landing/Hero'));
const DemoShowcase = lazy(() => import('../components/landing/DemoShowcase'));
const FeaturesBento = lazy(() => import('../components/landing/FeaturesBento'));
const HowItWorks = lazy(() => import('../components/landing/HowItWorks'));
const PricingCards = lazy(() => import('../components/landing/PricingCards'));
const Footer = lazy(() => import('../components/landing/Footer'));

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-emerald-500/30">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Navbar />
        <Hero />
        <DemoShowcase />
        <FeaturesBento />
        <HowItWorks />
        <PricingCards />
        <Footer />
      </Suspense>
    </div>
  );
}
