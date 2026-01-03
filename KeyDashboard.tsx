import React from 'react';
import { ApiKey } from '../types';
import { Trash2, Copy, Search, FileText } from 'lucide-react';
import { downloadKeys } from '../utils';

interface KeyDashboardProps {
  keys: ApiKey[];
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

export const KeyDashboard: React.FC<KeyDashboardProps> = ({ keys, onDelete, onDeleteAll }) => {
  const [search, setSearch] = React.useState('');

  const filteredKeys = keys.filter(k => 
    k.key.toLowerCase().includes(search.toLowerCase()) || 
    k.note.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getKeyStatus = (key: ApiKey) => {
    if (key.expiresAt === null) return 'lifetime';
    if (Date.now() > key.expiresAt) return 'expired';
    return 'active';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Active Keys</h2>
          <p className="text-gray-400 text-sm">Total Keys: <span className="text-hacker-green font-mono">{keys.length}</span></p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => downloadKeys(filteredKeys)}
            disabled={filteredKeys.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/80 text-white rounded border border-slate-600/50 hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm backdrop-blur-sm"
          >
            <FileText size={16} /> Export
          </button>
          <button 
             onClick={onDeleteAll}
             disabled={keys.length === 0}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-900/40 text-red-400 rounded border border-red-900/50 hover:bg-red-900/60 transition-colors disabled:opacity-50 text-sm backdrop-blur-sm"
          >
            <Trash2 size={16} /> Wipe All
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search keys or notes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/50 border border-hacker-border/50 pl-10 p-3 rounded text-white focus:border-hacker-green focus:outline-none transition-colors backdrop-blur-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-black/60 backdrop-blur-md border border-hacker-border/50 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider font-mono">
                <th className="p-4 border-b border-hacker-border/50">API Key</th>
                <th className="p-4 border-b border-hacker-border/50">Status</th>
                <th className="p-4 border-b border-hacker-border/50">Note</th>
                <th className="p-4 border-b border-hacker-border/50">Expires</th>
                <th className="p-4 border-b border-hacker-border/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hacker-border/30">
              {filteredKeys.length > 0 ? (
                filteredKeys.map((k) => {
                  const status = getKeyStatus(k);
                  return (
                    <tr key={k.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-mono text-hacker-green text-sm select-all w-1/3">{k.key}</td>
                      <td className="p-4">
                        {status === 'lifetime' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                            Lifetime
                          </span>
                        )}
                        {status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold uppercase shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                            Active
                          </span>
                        )}
                        {status === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">{k.note}</td>
                      <td className="p-4 text-gray-500 text-sm font-mono">
                        {k.expiresAt 
                          ? new Date(k.expiresAt).toLocaleDateString() 
                          : <span className="text-gray-600">Never</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => copyToClipboard(k.key)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Copy"
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(k.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Revoke"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No keys found. Generate some keys to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};