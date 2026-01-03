import React, { useState } from 'react';
import { ApiKey } from '../types';
import { ShieldCheck, ShieldAlert, Shield, Loader2, Clock } from 'lucide-react';

interface KeySimulatorProps {
  keys: ApiKey[];
}

export const KeySimulator: React.FC<KeySimulatorProps> = ({ keys }) => {
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid' | 'expired'>('idle');
  const [matchedKey, setMatchedKey] = useState<ApiKey | null>(null);

  const handleVerify = () => {
    setStatus('loading');
    setMatchedKey(null);

    // Simulate Network Delay
    setTimeout(() => {
      const match = keys.find(k => k.key === inputKey);
      if (match) {
        setMatchedKey(match);
        // Check Expiration
        if (match.expiresAt !== null && match.expiresAt !== undefined && Date.now() > match.expiresAt) {
           setStatus('expired');
        } else {
           setStatus('valid');
        }
      } else {
        setStatus('invalid');
      }
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">API Endpoint Simulator</h2>
        <p className="text-gray-400 mt-2">
           Test your keys here to see how the Lua script would interact with the server.
        </p>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-hacker-border/50 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hacker-green to-transparent opacity-50"></div>
        
        <div className="space-y-4 relative z-10">
           <label className="block text-sm font-mono text-gray-400">Enter Key to Validate</label>
           <div className="flex gap-2">
              <input 
                type="text" 
                value={inputKey}
                onChange={(e) => {
                    setInputKey(e.target.value);
                    if(status !== 'idle') setStatus('idle');
                }}
                placeholder="Paste key here..."
                className={`w-full bg-black/50 border p-4 rounded text-lg font-mono text-white focus:outline-none transition-all backdrop-blur-sm ${
                    status === 'valid' ? 'border-green-500' : 
                    status === 'invalid' || status === 'expired' ? 'border-red-500' : 
                    'border-hacker-border/50 focus:border-hacker-green'
                }`}
              />
              <button 
                 onClick={handleVerify}
                 disabled={status === 'loading' || !inputKey}
                 className="bg-white/90 text-black font-bold px-6 py-2 rounded hover:bg-white disabled:opacity-50 transition-colors backdrop-blur-sm"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Check'}
              </button>
           </div>
        </div>

        {/* Status Display */}
        <div className="mt-8 flex justify-center min-h-[120px]">
           {status === 'idle' && (
              <div className="text-gray-500 flex flex-col items-center justify-center">
                 <Shield size={48} className="mb-2 opacity-20" />
                 <span className="font-mono text-sm">Ready for input...</span>
              </div>
           )}

           {status === 'loading' && (
             <div className="text-hacker-green flex flex-col items-center justify-center animate-pulse">
                <div className="font-mono">VERIFYING HASH...</div>
                <div className="text-xs text-gray-500 mt-1">CONNECTING TO DATABASE</div>
             </div>
           )}

           {status === 'valid' && matchedKey && (
             <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 w-full text-center animate-in zoom-in duration-300">
                <div className="flex justify-center mb-2">
                   <div className="bg-green-500 text-black p-2 rounded-full shadow-lg shadow-green-500/20">
                      <ShieldCheck size={32} />
                   </div>
                </div>
                <h3 className="text-green-400 font-bold text-xl tracking-wider mb-1">ACCESS GRANTED</h3>
                <p className="text-green-200/60 font-mono text-sm mb-4">Key is valid and active.</p>
                <div className="text-left bg-black/40 p-3 rounded text-sm font-mono border border-green-500/20 backdrop-blur-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-500">ID:</span>
                     <span className="text-gray-300">{matchedKey.id.substring(0, 8)}...</span>
                   </div>
                   <div className="flex justify-between mt-1">
                     <span className="text-gray-500">Expires:</span>
                     <span className="text-white">
                        {matchedKey.expiresAt ? new Date(matchedKey.expiresAt).toLocaleDateString() : 'Never (Lifetime)'}
                     </span>
                   </div>
                </div>
             </div>
           )}

           {status === 'expired' && matchedKey && (
             <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 w-full text-center animate-in zoom-in duration-300">
                <div className="flex justify-center mb-2">
                   <div className="bg-red-500 text-black p-2 rounded-full shadow-lg shadow-red-500/20">
                      <Clock size={32} />
                   </div>
                </div>
                <h3 className="text-red-400 font-bold text-xl tracking-wider mb-1">KEY EXPIRED</h3>
                <p className="text-red-200/60 font-mono text-sm mb-2">"Key Expried, plz buy a new key"</p>
                <div className="text-xs text-gray-500 mt-2">
                   Expired on: {new Date(matchedKey.expiresAt!).toLocaleDateString()}
                </div>
             </div>
           )}

           {status === 'invalid' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 w-full text-center animate-in zoom-in duration-300">
                <div className="flex justify-center mb-2">
                   <div className="bg-red-500 text-black p-2 rounded-full shadow-lg shadow-red-500/20">
                      <ShieldAlert size={32} />
                   </div>
                </div>
                <h3 className="text-red-400 font-bold text-xl tracking-wider mb-1">ACCESS DENIED</h3>
                <p className="text-red-200/60 font-mono text-sm">Key not found in database.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};