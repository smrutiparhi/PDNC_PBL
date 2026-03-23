import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Eye, AlertTriangle, CheckCircle, Search, Filter, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

const mockHistory = [
  { id: 'SCN-1049', date: '2026-03-23 10:45 AM', location: 'Amazon Rainforest Sect-4', type: 'Deforestation Analysis', score: 0.042, status: 'anomaly' },
  { id: 'SCN-1048', date: '2026-03-23 09:12 AM', location: 'Gulf of Mexico Alpha', type: 'Oil Spill Detection', score: 0.089, status: 'critical' },
  { id: 'SCN-1047', date: '2026-03-22 14:30 PM', location: 'Sahara Border-Zone', type: 'Routine Terrain', score: 0.004, status: 'clear' },
  { id: 'SCN-1046', date: '2026-03-22 11:20 AM', location: 'Urban Outskirts NYC', type: 'Construction Bounds', score: 0.031, status: 'anomaly' },
  { id: 'SCN-1045', date: '2026-03-21 16:55 PM', location: 'Pacific Ocean Grid-9', type: 'Routine Maritime', score: 0.002, status: 'clear' },
];

export default function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col gap-6"
    >
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by ID or Location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-all">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-400 text-xs font-mono uppercase tracking-widest border-b border-zinc-800/80">
                <th className="px-6 py-4 font-bold">Scan ID</th>
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold">Region/Type</th>
                <th className="px-6 py-4 font-bold text-center">MSE Score</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {mockHistory.map((scan) => (
                <tr key={scan.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-emerald-400 text-sm">{scan.id}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm whitespace-nowrap">
                    {scan.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-200 font-medium text-sm">{scan.location}</span>
                      <span className="text-zinc-500 text-xs mt-0.5">{scan.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-zinc-300 text-sm bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{scan.score.toFixed(4)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {scan.status === 'clear' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {scan.status === 'anomaly' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {scan.status === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        scan.status === 'clear' ? "text-emerald-500" :
                        scan.status === 'anomaly' ? "text-amber-500" : "text-rose-500"
                      )}>
                        {scan.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="View Heatmap">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors" title="Download Report">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
