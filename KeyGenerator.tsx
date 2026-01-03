import React, { useState } from 'react';
import { GeneratorOptions, ApiKey } from '../types';
import { generateKeyString, downloadKeys } from '../utils';
import { Download, Zap, Save, Clock } from 'lucide-react';

interface KeyGeneratorProps {
  onAddKeys: (keys: ApiKey[]) => void;
}

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({ onAddKeys }) => {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 15,
    quantity: 1,
    note: 'Premium User',
    durationDays: 7, // Default to 7 days
  });
  
  const [generatedPreview, setGeneratedPreview] = useState<ApiKey[]>([]);

  const handleGeneratePreview = () => {
    // Sanitize inputs before generating
    const qty = (isNaN(options.quantity) || options.quantity < 1) ? 1 : options.quantity;
    const len = (isNaN(options.length) || options.length < 1) ? 15 : options.length;

    const now = Date.now();
    // Calculate expiration: 0 = null (lifetime), otherwise current time + days * ms
    const expiresAt = options.durationDays === 0 
      ? null 
      : now + (options.durationDays * 24 * 60 * 60 * 1000);

    const newKeys: ApiKey[] = [];
    for (let i = 0; i < qty; i++) {
      newKeys.push({
        id: crypto.randomUUID(),
        key: generateKeyString(len),
        note: options.note,
        createdAt: now,
        expiresAt: expiresAt,
      });
    }
    setGeneratedPreview(newKeys);
  };

  const handleSaveToDatabase = () => {
    onAddKeys(generatedPreview);
    setGeneratedPreview([]);
    // Optional: Show success toast
    alert(`Successfully saved ${generatedPreview.length} keys to database.`);
  };

  const handleDownload = () => {
    downloadKeys(generatedPreview);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-black/60 backdrop-blur-md border border-hacker-border/50 rounded-xl p-4 md:p-6 shadow-xl relative overflow-hidden">
        {/* Decorative corner flash */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-hacker-green/5 blur-3xl -z-10 rounded-full"></div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="text-hacker-green" /> Generate Keys
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Key Length</label>
            <input
              type="number"
              min="10"
              max="64"
              value={isNaN(options.length) ? '' : options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full bg-black/50 border border-hacker-border/50 text-white p-3 rounded focus:border-hacker-green focus:outline-none focus:ring-1 focus:ring-hacker-green transition-all backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={isNaN(options.quantity) ? '' : options.quantity}
              onChange={(e) => setOptions({ ...options, quantity: parseInt(e.target.value) })}
              className="w-full bg-black/50 border border-hacker-border/50 text-white p-3 rounded focus:border-hacker-green focus:outline-none focus:ring-1 focus:ring-hacker-green transition-all backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Validity Period</label>
            <div className="relative">
              <select 
                value={options.durationDays}
                onChange={(e) => setOptions({...options, durationDays: parseInt(e.target.value)})}
                className="w-full bg-black/50 border border-hacker-border/50 text-white p-3 rounded focus:border-hacker-green focus:outline-none focus:ring-1 focus:ring-hacker-green transition-all appearance-none cursor-pointer backdrop-blur-sm"
              >
                <option value={1}>1 Day (Trial)</option>
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={365}>365 Days (1 Year)</option>
                <option value={0}>Lifetime</option>
              </select>
              <Clock className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-gray-400 mb-2">Note / Prefix</label>
            <input
              type="text"
              value={options.note}
              onChange={(e) => setOptions({ ...options, note: e.target.value })}
              placeholder="e.g. Buyer Name"
              className="w-full bg-black/50 border border-hacker-border/50 text-white p-3 rounded focus:border-hacker-green focus:outline-none focus:ring-1 focus:ring-hacker-green transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        <button
          onClick={handleGeneratePreview}
          className="w-full bg-hacker-green text-black font-bold py-3 rounded hover:bg-hacker-dim hover:text-white transition-all transform active:scale-95 shadow-[0_0_15px_rgba(0,255,65,0.3)]"
        >
          GENERATE KEYS
        </button>
      </div>

      {generatedPreview.length > 0 && (
        <div className="bg-black/60 backdrop-blur-md border border-hacker-border/50 rounded-xl p-4 md:p-6 shadow-xl">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-white">Preview ({generatedPreview.length})</h3>
              <div className="flex gap-2 w-full md:w-auto">
                 <button
                    onClick={handleDownload}
                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-slate-800/80 text-white rounded border border-slate-600/50 hover:bg-slate-700 transition-colors text-sm backdrop-blur-sm"
                 >
                    <Download size={16} /> <span className="md:hidden">Save .txt</span> <span className="hidden md:inline">Download .txt</span>
                 </button>
                 <button
                    onClick={handleSaveToDatabase}
                    className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600/90 text-white rounded border border-blue-500 hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)] text-sm backdrop-blur-sm"
                 >
                    <Save size={16} /> <span className="md:hidden">Add</span> <span className="hidden md:inline">Save to Manager</span>
                 </button>
              </div>
           </div>
           
           <div className="bg-black/50 rounded-lg p-4 border border-hacker-border/50 max-h-64 overflow-y-auto font-mono text-sm">
              {generatedPreview.map((k, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5 last:border-0 gap-1 sm:gap-0">
                  <span className="text-hacker-green break-all">{k.key}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs sm:text-sm">{k.note}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      k.expiresAt === null 
                        ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' 
                        : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                    }`}>
                      {k.expiresAt === null ? 'LIFETIME' : `${options.durationDays}D`}
                    </span>
                  </div>
                </div>
              ))}
           </div>
           <p className="text-xs text-gray-500 mt-3 text-center">
             Review keys before saving. Unsaved keys will be lost on refresh.
           </p>
        </div>
      )}
    </div>
  );
};