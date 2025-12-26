
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ImageLab from './components/ImageLab';
import VideoStudio from './components/VideoStudio';
import Settings from './components/Settings';
import { AppView, GenerationSettings } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '16:9',
    imageSize: '1K',
    videoResolution: '1080p',
    useThinking: false,
    useSearch: true,
  });

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeySelected(selected);
      } else {
        // Fallback for non-platform environment if needed, but per instructions we assume presence.
        setApiKeySelected(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success after prompt per instructions
      setApiKeySelected(true);
    }
  };

  if (!apiKeySelected && (window as any).aistudio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4">
        <div className="glass max-w-md w-full p-8 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto shadow-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black gradient-text">Welcome to DreamBoost</h1>
          <p className="text-gray-400">To unlock the full potential of DreamBoost AI, including Veo Video and Pro Image models, please select your API key.</p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-xl"
          >
            Select API Key
          </button>
          <p className="text-xs text-gray-500">
            Ensure you use an API key from a paid GCP project. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 ml-1 hover:underline">Billing Docs</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {currentView === 'chat' && <ChatInterface settings={settings} />}
        {currentView === 'images' && <ImageLab settings={settings} />}
        {currentView === 'videos' && <VideoStudio settings={settings} />}
        {currentView === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
        {currentView === 'code' && (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div className="space-y-4 max-w-md">
              <div className="text-blue-500 animate-pulse inline-block p-4 glass rounded-full mb-4">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h2 className="text-3xl font-bold">Integrated Code Architect</h2>
              <p className="text-gray-400">
                You can generate and analyze code directly in the <strong>Intelligent Chat</strong> view. 
                Use commands like <code className="bg-white/10 px-1 rounded text-blue-400">/code create</code> 
                or enable <strong>Deep Thinking</strong> in settings for advanced architecture.
              </p>
              <button onClick={() => setCurrentView('chat')} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all mt-4">
                Go to Chat
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
