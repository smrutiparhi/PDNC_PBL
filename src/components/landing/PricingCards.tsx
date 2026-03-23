import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const plans = [
  {
    name: "Standard",
    description: "Ideal for researchers and small teams analyzing sample datasets.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      { text: "1,000 Scans / month", included: true },
      { text: "ResNet-50 Base Model", included: true },
      { text: "720p Resolution limit", included: true },
      { text: "Basic MSE Reporting", included: true },
      { text: "API Access", included: false },
      { text: "Dedicated GPU Cluster", included: false },
    ],
    popular: false,
    cta: "Start Free Trial"
  },
  {
    name: "Pro",
    description: "For commercial operations needing high-fidelity real-time analysis.",
    monthlyPrice: 249,
    yearlyPrice: 199,
    features: [
      { text: "10,000 Scans / month", included: true },
      { text: "Custom Model Tuning", included: true },
      { text: "4K Resolution Support", included: true },
      { text: "SSIM & PSNR Metrics", included: true },
      { text: "API Access (100 req/s)", included: true },
      { text: "Dedicated GPU Cluster", included: false },
    ],
    popular: true,
    cta: "Get Pro Access"
  },
  {
    name: "Enterprise",
    description: "Military-grade air-gapped deployments & unlimited processing.",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    features: [
      { text: "Unlimited Scans", included: true },
      { text: "On-Premises Deployment", included: true },
      { text: "8K+ Resolution Processing", included: true },
      { text: "Custom Alerting Systems", included: true },
      { text: "Unlimited API Access", included: true },
      { text: "Dedicated GPU Cluster", included: true },
    ],
    popular: false,
    cta: "Contact Sales"
  }
];

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-32 bg-[#050505] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight mb-6"
          >
            Transparent Pricing
          </motion.h2>

          {/* Billing Toggle */}
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-1.5 rounded-full shadow-inner">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                !isYearly ? "bg-zinc-800 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                isYearly ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Yearly <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col bg-zinc-900/50 backdrop-blur-md border transition-all duration-300 hover:-translate-y-2",
                plan.popular 
                  ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-emerald-500/10 before:to-transparent before:rounded-3xl before:-z-10" 
                  : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg shadow-emerald-500/30">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-zinc-100 mb-2">{plan.name}</h3>
              <p className="text-sm text-zinc-400 mb-8 min-h-[40px]">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  {typeof plan.monthlyPrice === "number" ? "$" : ""}
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                {typeof plan.monthlyPrice === "number" && (
                  <span className="text-zinc-500 text-sm font-medium">/ month</span>
                )}
              </div>

              <button className={cn(
                "w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-8",
                plan.popular 
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700"
              )}>
                {plan.cta}
              </button>

              <div className="flex flex-col gap-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border",
                      feature.included 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-zinc-800 border-zinc-800 text-zinc-600"
                    )}>
                      {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      feature.included ? "text-zinc-300" : "text-zinc-600"
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
