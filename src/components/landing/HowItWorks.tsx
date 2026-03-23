import React from 'react';
import { motion } from 'motion/react';
import { HardDrive, Network, MapPin, DatabaseBackup } from 'lucide-react';

const steps = [
  {
    title: "Data Ingestion",
    description: "Upload TIFF/PNG imagery or connect live satellite S3 buckets.",
    icon: <DatabaseBackup className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Latent Encoding",
    description: "ResNet-50 backbone compresses spatial features sequentially down to a 16x16 latent space.",
    icon: <Network className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Reconstruction",
    description: "Decoder layers reconstruct the image, predicting normal terrain configurations.",
    icon: <HardDrive className="w-5 h-5 text-emerald-400" />
  },
  {
    title: "Anomaly Isolation",
    description: "Pixel-wise MSE reveals structural deviations, instantly highlighting unexpected objects.",
    icon: <MapPin className="w-5 h-5 text-emerald-400" />
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#020202] border-t border-zinc-900 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight"
          >
            Inference Pipeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 mt-4 max-w-2xl mx-auto font-medium"
          >
            A look under the hood. Our residual autoencoder compares structural reality against learned expectations to find what doesn't belong.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-zinc-800 -z-10">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Number Badge */}
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 flex items-center justify-center mb-6 absolute -top-4 -left-4 z-20 shadow-lg shadow-black group-hover:border-emerald-500 transition-colors">
                  0{index + 1}
                </div>

                {/* Icon Container */}
                <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 mb-8 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-200 mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
