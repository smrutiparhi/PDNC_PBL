import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, HardDrive, Key, User, CreditCard } from 'lucide-react';

export default function SystemSettings() {
  const [compute, setCompute] = useState(70);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* Settings Navigation Menu */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border-l-4 border-emerald-500 text-zinc-100 rounded-r-lg font-medium shadow-lg">
          <HardDrive className="w-5 h-5 text-emerald-400" /> Infrastructure Quotas
        </button>
        <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 border-l-4 border-transparent text-zinc-400 hover:text-zinc-200 rounded-r-lg transition-colors font-medium">
          <Key className="w-5 h-5" /> API Keys & Access
        </button>
        <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 border-l-4 border-transparent text-zinc-400 hover:text-zinc-200 rounded-r-lg transition-colors font-medium">
          <Shield className="w-5 h-5" /> IAM Policies
        </button>
        <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 border-l-4 border-transparent text-zinc-400 hover:text-zinc-200 rounded-r-lg transition-colors font-medium">
          <User className="w-5 h-5" /> Account Details
        </button>
        <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 border-l-4 border-transparent text-zinc-400 hover:text-zinc-200 rounded-r-lg transition-colors font-medium">
          <CreditCard className="w-5 h-5" /> Billing & Usage
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="lg:col-span-9 flex flex-col gap-8">

        {/* Computing Quotas Block */}
        <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center gap-3">
            <Settings className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-zinc-100">Inference Cluster Limits</h2>
          </div>

          <div className="p-6 space-y-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-zinc-300">GPU Allocation Limit (A100 Instances)</label>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 rounded-md border border-emerald-500/20">{compute}% / 100%</span>
              </div>
              <p className="text-xs text-zinc-500 mb-2">Adjusting this hardware quota specifies maximum bandwidth used during batch inference tracking.</p>
              <input
                type="range"
                min="10" max="100" step="5"
                value={compute} onChange={(e) => setCompute(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/80">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">Tensor Memory Cache</label>
                <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50">
                  <option>16 GB (Standard)</option>
                  <option>32 GB (High Perf)</option>
                  <option>64 GB (Ultra)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">Default Latent Output Logging</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="log" className="accent-emerald-500" defaultChecked />
                    <span className="text-sm text-zinc-400">Verbose</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="log" className="accent-emerald-500" />
                    <span className="text-sm text-zinc-400">Warnings Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 px-6 py-4 border-t border-zinc-800/80 flex justify-end gap-3">
            <button className="px-5 py-2.5 rounded-xl font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Discard Defaults</button>
            <button className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">Save Quota Topology</button>
          </div>
        </div>

        {/* Warning Block */}
        <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-xl flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 shrink-0 mt-1">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-400 mb-1">Danger Zone</h3>
            <p className="text-sm text-zinc-400 mb-4">Deleting this cloud inference node will permanently destroy all underlying weights and unarchived historical anomalies.</p>
            <button className="px-5 py-2.5 bg-rose-500/10 text-rose-500 font-bold border border-rose-500/30 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg hidden sm:inline-block">Purge AI Pipeline</button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
