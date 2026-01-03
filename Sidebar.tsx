import React from 'react';
import { Tab } from '../types';
import { Terminal, Key, Code, ShieldCheck, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Keys', icon: <LayoutDashboard size={20} /> },
    { id: 'generate', label: 'Create', icon: <Key size={20} /> },
    { id: 'lua-setup', label: 'Script', icon: <Code size={20} /> },
    { id: 'simulate', label: 'Test', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-black/80 backdrop-blur-md border-r border-hacker-border/50 flex-col h-screen fixed left-0 top-0 z-40">
        <div className="p-6 flex items-center gap-3 border-b border-hacker-border/50">
          <div className="p-2 bg-hacker-green/10 rounded border border-hacker-green/30 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
            <Terminal className="text-hacker-green" size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wider">LUA<span className="text-hacker-green">AUTH</span></h1>
            <p className="text-xs text-gray-500">Exploit Key System</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentTab === item.id
                  ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30 shadow-[0_0_10px_rgba(0,255,65,0.1)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label === 'Keys' ? 'Keys Manager' : item.label === 'Create' ? 'Generate Keys' : item.label === 'Script' ? 'Lua Script' : 'Test API'}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-hacker-border/50">
          <div className="bg-slate-900/40 p-3 rounded border border-dashed border-slate-700/50 text-xs text-gray-500 text-center">
            Status: <span className="text-hacker-green">ONLINE</span>
            <br/>
            Happy New Year! 🎆
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-hacker-border flex justify-around items-center p-2 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all w-16 ${
               currentTab === item.id ? 'text-hacker-green bg-white/5' : 'text-gray-500'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};