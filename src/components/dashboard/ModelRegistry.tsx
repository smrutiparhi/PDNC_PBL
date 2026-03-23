import React from 'react';
import { motion } from 'motion/react';
import { Database, UploadCloud, Cpu, Zap, Activity, CheckCircle, RefreshCcw } from 'lucide-react';

const mockModels = [
  { id: 'ResNet-50 v2.4.1-prod', params: '23.5M', type: 'Convolutional Autoencoder', accuracy: '98.4%', status: 'deployed' },
  { id: 'DenseNet-121 v1.2.0-beta', params: '8.0M', type: 'Variational Autoencoder', accuracy: '96.8%', status: 'training' },
  { id: 'MobileNetV3 v3.0.0-rc1', params: '5.4M', type: 'Edge Detection Node', accuracy: '93.2%', status: 'archived' },
];

export default function ModelRegistry() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <UploadCloud className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100 mb-1">External S3 Checkpoints</h2>
              <p className="text-sm text-zinc-400">Connect a secure Amazon S3 bucket to import massive `.pth` or `.onnx` checkpoint weights automatically.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 whitespace-nowrap">
            Connect Bucket
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <div>
        <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" /> Available Architectures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockModels.map((model, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-zinc-700 transition-colors flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono border bg-opacity-10"
                   style={{
                     borderColor: model.status === 'deployed' ? 'rgba(16, 185, 129, 0.4)' : model.status === 'training' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(113, 113, 122, 0.4)',
                     backgroundColor: model.status === 'deployed' ? 'rgba(16, 185, 129, 0.1)' : model.status === 'training' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(113, 113, 122, 0.1)',
                     color: model.status === 'deployed' ? '#34d399' : model.status === 'training' ? '#fbbf24' : '#a1a1aa'
                   }}>
                  {model.status === 'deployed' && <CheckCircle className="w-3 h-3" />}
                  {model.status === 'training' && <RefreshCcw className="w-3 h-3 animate-spin" />}
                  {model.status}
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-zinc-100 mb-1">{model.id}</h4>
              <p className="text-sm text-zinc-500 mb-6">{model.type}</p>
              
              <div className="space-y-4 mb-6 mt-auto">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-2"><Activity className="w-4 h-4" /> Parameters</span>
                  <span className="font-mono text-zinc-300 font-bold">{model.params}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 flex items-center gap-2"><Zap className="w-4 h-4" /> Validation Acc</span>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{model.accuracy}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">
                  Details
                </button>
                <button 
                  disabled={model.status === 'deployed'}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    model.status === 'deployed' 
                    ? "bg-emerald-500/10 text-emerald-500/50 cursor-not-allowed border border-emerald-500/10" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
                >
                  {model.status === 'deployed' ? 'Active Target' : 'Deploy Weights'}
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer min-h-[300px] shadow-xl inset-0">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 shadow-xl">
              <span className="text-3xl">+</span>
            </div>
            <p className="font-bold text-lg">Train New Architecture</p>
            <p className="text-sm text-zinc-600 mt-2 text-center">Open Jupyter lab integration.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
