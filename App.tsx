import React, { useState, useEffect } from 'react';
import { ApiKey, Tab } from './types';
import { Sidebar } from './components/Sidebar';
import { KeyGenerator } from './components/KeyGenerator';
import { KeyDashboard } from './components/KeyDashboard';
import { LuaIntegration } from './components/LuaIntegration';
import { KeySimulator } from './components/KeySimulator';
import { FakeLandingPage } from './components/FakeLandingPage';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTab, setTab] = useState<Tab>('dashboard');
  const [keys, setKeys] = useState<ApiKey[]>([]);

  // Load keys from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lua_auth_keys');
    if (saved) {
      try {
        setKeys(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load keys", e);
      }
    }
  }, []);

  // Save keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lua_auth_keys', JSON.stringify(keys));
  }, [keys]);

  const handleAddKeys = (newKeys: ApiKey[]) => {
    setKeys((prev) => [...newKeys, ...prev]);
    setTab('dashboard');
  };

  const handleDeleteKey = (id: string) => {
    setKeys((prev) => prev.filter(k => k.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete ALL keys? This cannot be undone.")) {
      setKeys([]);
    }
  };

  // If the app is not unlocked via the Fake Landing Page hidden trigger, show the Fake Landing Page
  if (!isUnlocked) {
    return <FakeLandingPage onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen text-gray-200 font-sans bg-[#050505]">
      <Sidebar currentTab={currentTab} setTab={setTab} />
      
      {/* 
         md:ml-64 -> Add left margin only on desktop to make room for fixed sidebar
         pb-24 -> Add bottom padding on mobile to make room for fixed bottom nav 
         pb-8 -> Normal padding on desktop
      */}
      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        {/* Header Area */}
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
           <div>
             <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
               {currentTab === 'dashboard' && 'Dashboard'}
               {currentTab === 'generate' && 'Generator'}
               {currentTab === 'lua-setup' && 'Lua Integration'}
               {currentTab === 'simulate' && 'API Simulator'}
             </h1>
             <p className="text-gray-400 mt-1 text-sm md:text-base font-medium">
               {currentTab === 'dashboard' && 'Manage your active exploit keys.'}
               {currentTab === 'generate' && 'Create secure keys with custom rules.'}
               {currentTab === 'lua-setup' && 'Get the code for your exploit script.'}
               {currentTab === 'simulate' && 'Test your keys against the mock server.'}
             </p>
           </div>
        </header>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto md:mx-0">
          {currentTab === 'dashboard' && (
            <KeyDashboard 
              keys={keys} 
              onDelete={handleDeleteKey} 
              onDeleteAll={handleDeleteAll}
            />
          )}
          
          {currentTab === 'generate' && (
            <KeyGenerator onAddKeys={handleAddKeys} />
          )}

          {currentTab === 'lua-setup' && (
            <LuaIntegration keys={keys} />
          )}

          {currentTab === 'simulate' && (
            <KeySimulator keys={keys} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;