import React, { useState, useEffect } from 'react';
import { Crosshair, History, Activity, Database, Settings, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  picture?: string;
}

const navItems = [
  { id: 'scan', label: 'Current Scan', icon: <Activity className="w-5 h-5" /> },
  { id: 'history', label: 'Scan History', icon: <History className="w-5 h-5" /> },
  { id: 'models', label: 'AI Models', icon: <Database className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserProfile(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data", e);
      }
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-zinc-800/80 flex flex-col z-40">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800/80 bg-zinc-900/30">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 p-2 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Crosshair className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-[15px] text-zinc-100 block leading-none">
              Satellite Anomaly
            </span>
            <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">
              Pro Edition
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
        <div className="text-xs font-mono text-zinc-500 mb-4 px-2 uppercase tracking-widest">Workspace</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm",
              activeTab === item.id 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Area Footer */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/20">
        <div className="flex items-center gap-3 px-2 py-2 mb-4">
          {userProfile?.picture ? (
            <img src={userProfile.picture} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-700 object-cover" />
          ) : (
             <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
               <User className="w-4 h-4 text-zinc-400" />
             </div>
          )}
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-sm font-medium text-zinc-200 truncate">{userProfile?.name || "Admin User"}</span>
            <span className="text-xs text-zinc-500 truncate">{userProfile?.email || "admin@satellite.ai"}</span>
          </div>
        </div>
        
        <Link 
          to="/login"
          onClick={() => localStorage.removeItem('user')}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
