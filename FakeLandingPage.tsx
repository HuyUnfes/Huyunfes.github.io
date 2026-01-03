import React, { useState, useEffect, useRef } from 'react';
import { Lock, X } from 'lucide-react';

interface FakeLandingPageProps {
  onUnlock: () => void;
}

export const FakeLandingPage: React.FC<FakeLandingPageProps> = ({ onUnlock }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  
  // Trigger Counters
  const rPressCount = useRef(0);
  const swipeCount = useRef(0);
  
  // Touch tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // --- PC Trigger: Press 'R' 4 times ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if 'r' is pressed (case insensitive)
      if (e.key.toLowerCase() === 'r') {
        rPressCount.current += 1;
        if (rPressCount.current >= 4) {
          setShowAuth(true);
          rPressCount.current = 0; // Reset
        }
      } else {
        // Optional: Reset logic could go here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Mobile Trigger: Swipe Right-to-Left 4 times ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null; // Reset end
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50; // Threshold for swipe

    if (isSwipeLeft) {
      swipeCount.current += 1;
      if (swipeCount.current >= 4) {
        setShowAuth(true);
        swipeCount.current = 0;
      }
    }
    // Reset for next touch
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleVerify = () => {
    if (keyInput === 'Exviun') {
      onUnlock();
    } else {
      setError('Invalid Key');
      setKeyInput('');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-[#333] font-serif p-8 flex flex-col relative overflow-hidden selection:bg-gray-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fake 403 Content */}
      <div className="max-w-3xl mt-12">
        <h1 className="text-4xl font-bold mb-4 text-black">403 Forbidden</h1>
        <hr className="border-t border-gray-300 my-6" />
        <p className="mb-4">You don't have permission to access this resource.</p>
      </div>

      {/* Hidden Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300 font-sans text-white">
          <div className="bg-[#111] border border-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Lock size={28} />
              </div>
            </div>
            
            <h2 className="text-center text-xl font-bold mb-2">System Unlock</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Enter passkey to bypass restriction.</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter Passkey"
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-center text-white focus:border-blue-500 focus:outline-none transition-all"
                autoFocus
              />
              
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              
              <button
                onClick={handleVerify}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};